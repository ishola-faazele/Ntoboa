import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Contract, Signer } from "ethers";

describe("Ntoboa", function () {
  // FIXTURES
  async function deployNtoboaFixture() {
    const [owner, donor, nonOwner] = await ethers.getSigners();
    const Ntoboa = await ethers.getContractFactory("Ntoboa");
    const ntoboa = await Ntoboa.deploy();
    await ntoboa.waitForDeployment();

    const testData = {
      charityName: "Charity 1",
      charityDescription: "Helping others",
      charityTarget: ethers.parseEther("10"),
      charityName2: "Charity 2",
      charityDescription2: "No donations needed",
      charityTarget2: ethers.parseEther("0"),
      donationAmount: ethers.parseEther("1"),
      largeDonationAmount: ethers.parseEther("2"),
    };

    return { ntoboa, owner, donor, nonOwner, testData };
  }

  async function deployAndCreateCharityFixture() {
    const { ntoboa, owner, donor, nonOwner, testData } = await loadFixture(
      deployNtoboaFixture
    );

    await ntoboa.addCharity(
      testData.charityName,
      testData.charityDescription,
      testData.charityTarget
    );

    await ntoboa.connect(donor).donate(0, { value: testData.donationAmount });

    return { ntoboa, owner, donor, nonOwner, testData };
  }

  async function deployMultipleCharitiesFixture() {
    const { ntoboa, owner, donor, nonOwner, testData } = await loadFixture(
      deployNtoboaFixture
    );

    // Create first charity
    await ntoboa.addCharity(
      testData.charityName,
      testData.charityDescription,
      testData.charityTarget
    );

    // Create second charity
    await ntoboa.addCharity(
      "Second Charity",
      "Another good cause",
      ethers.parseEther("5")
    );

    // Donate to both charities
    await ntoboa.connect(donor).donate(0, { value: testData.donationAmount });
    await ntoboa
      .connect(donor)
      .donate(1, { value: testData.largeDonationAmount });

    return { ntoboa, owner, donor, nonOwner, testData };
  }

  // TESTS
  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { ntoboa } = await loadFixture(deployNtoboaFixture);
      expect(await ntoboa.getAddress()).to.be.properHex(40);
    });

    it("Should initialize with nextCharityId as 0", async function () {
      const { ntoboa } = await loadFixture(deployNtoboaFixture);
      expect(await ntoboa.nextCharityId()).to.equal(0);
    });

    it("Should initialize with zero total amount raised", async function () {
      const { ntoboa } = await loadFixture(deployNtoboaFixture);
      expect(await ntoboa.totalAmountRaised()).to.equal(0);
    });
  });

  describe("Adding Charities", function () {
    it("Should create a new charity with correct parameters", async function () {
      const { ntoboa, owner, testData } = await loadFixture(
        deployNtoboaFixture
      );

      await ntoboa.addCharity(
        testData.charityName,
        testData.charityDescription,
        testData.charityTarget
      );

      const charity = await ntoboa.charities(0);

      expect(charity.name).to.equal(testData.charityName);
      expect(charity.description).to.equal(testData.charityDescription);
      expect(charity.target).to.equal(testData.charityTarget);
      expect(charity.owner).to.equal(await owner.getAddress());
      expect(charity.exists).to.equal(true);
      expect(charity.amountRaised).to.equal(0);
    });

    it("Should increment nextCharityId after creation", async function () {
      const { ntoboa, testData } = await loadFixture(deployNtoboaFixture);

      await ntoboa.addCharity(
        testData.charityName,
        testData.charityDescription,
        testData.charityTarget
      );

      expect(await ntoboa.nextCharityId()).to.equal(1);
    });

    it("Should emit CharityCreated event", async function () {
      const { ntoboa, owner, testData } = await loadFixture(
        deployNtoboaFixture
      );

      await expect(
        ntoboa.addCharity(
          testData.charityName,
          testData.charityDescription,
          testData.charityTarget
        )
      )
        .to.emit(ntoboa, "CharityCreated")
        .withArgs(
          0,
          testData.charityName,
          testData.charityDescription,
          testData.charityTarget,
          await owner.getAddress()
        );
    });

    it("Should revert with InvalidTarget for zero target amount", async function () {
      const { ntoboa, testData } = await loadFixture(deployNtoboaFixture);

      await expect(
        ntoboa.addCharity(
          testData.charityName2,
          testData.charityDescription2,
          testData.charityTarget2
        )
      ).to.be.revertedWithCustomError(ntoboa, "InvalidTarget");
    });
  });

  describe("Donations", function () {
    it("Should accept valid donations", async function () {
      const { ntoboa, donor, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await ntoboa
        .connect(donor)
        .donate(0, { value: testData.largeDonationAmount });

      const charity = await ntoboa.charities(0);
      expect(charity.amountRaised).to.equal(
        testData.donationAmount + testData.largeDonationAmount
      );
    });

    it("Should update total amount raised", async function () {
      const { ntoboa, donor, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await ntoboa
        .connect(donor)
        .donate(0, { value: testData.largeDonationAmount });

      expect(await ntoboa.totalAmountRaised()).to.equal(
        testData.donationAmount + testData.largeDonationAmount
      );
    });

    it("Should emit DonationReceived event", async function () {
      const { ntoboa, donor, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(
        ntoboa.connect(donor).donate(0, { value: testData.donationAmount })
      )
        .to.emit(ntoboa, "DonationReceived")
        .withArgs(0, await donor.getAddress(), testData.donationAmount);
    });

    it("Should revert for non-existent charity", async function () {
      const { ntoboa, donor, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(
        ntoboa.connect(donor).donate(999, { value: testData.donationAmount })
      ).to.be.revertedWithCustomError(ntoboa, "CharityDoesNotExist");
    });

    it("Should revert for zero donation amount", async function () {
      const { ntoboa, donor } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(ntoboa.connect(donor).donate(0, { value: 0 }))
        .to.be.revertedWithCustomError(ntoboa, "InsufficientBalance")
        .withArgs(0, 0);
    });
  });

  describe("Withdrawals", function () {
    it("Should allow charity owner to withdraw", async function () {
      const { ntoboa, owner } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(ntoboa.connect(owner).withdraw(0)).to.changeEtherBalances(
        [ntoboa, owner],
        [ethers.parseEther("-1"), ethers.parseEther("1")]
      );
    });

    it("Should revert if non-owner attempts withdrawal", async function () {
      const { ntoboa, owner, nonOwner } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(ntoboa.connect(nonOwner).withdraw(0))
        .to.be.revertedWithCustomError(ntoboa, "NotCharityOwner")
        .withArgs(await nonOwner.getAddress(), await owner.getAddress());
    });

    it("Should emit WithdrawalMade event", async function () {
      const { ntoboa, owner, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(ntoboa.connect(owner).withdraw(0))
        .to.emit(ntoboa, "WithdrawalMade")
        .withArgs(0, await owner.getAddress(), testData.donationAmount);
    });

    it("Should revert for non-existent charity", async function () {
      const { ntoboa, owner } = await loadFixture(
        deployAndCreateCharityFixture
      );

      await expect(
        ntoboa.connect(owner).withdraw(999)
      ).to.be.revertedWithCustomError(ntoboa, "CharityDoesNotExist");
    });

    it("Should revert if no funds to withdraw", async function () {
      const { ntoboa, owner, donor, nonOwner, testData } = await loadFixture(
        deployNtoboaFixture
      );

      // Create charity with no donations
      await ntoboa.addCharity(
        testData.charityName,
        testData.charityDescription,
        testData.charityTarget
      );

      // Try to withdraw from a charity that exists but has no donations
      await expect(ntoboa.connect(owner).withdraw(0))
        .to.be.revertedWithCustomError(ntoboa, "InsufficientBalance")
        .withArgs(0, 0);
    });
  });

  describe("Balance Queries", function () {
    it("Should return correct balance for charity", async function () {
      const { ntoboa, testData } = await loadFixture(
        deployAndCreateCharityFixture
      );

      expect(await ntoboa.getBalanceOf(0)).to.equal(testData.donationAmount);
    });

    it("Should return correct balance after multiple donations", async function () {
      const { ntoboa } = await loadFixture(deployMultipleCharitiesFixture);

      expect(await ntoboa.getBalanceOf(1)).to.equal(ethers.parseEther("2"));
    });

    it("Should revert for non-existent charity", async function () {
      const { ntoboa } = await loadFixture(deployAndCreateCharityFixture);

      await expect(ntoboa.getBalanceOf(999))
        .to.be.revertedWithCustomError(ntoboa, "CharityDoesNotExist")
        .withArgs(999);
    });
  });
  describe("Recieve", function () {
    it("Emit EtherRecieved event", async function () {
      const { ntoboa, owner, testData } = await loadFixture(
        deployNtoboaFixture
      );
      const amount = ethers.parseEther("1");
      await expect(
        owner.sendTransaction({
          to: ntoboa.getAddress(),
          value: amount, // Sending 1 ETH
        })
      )
        .to.emit(ntoboa, "EtherReceived") // Expect EtherReceived event
        .withArgs(
          owner.address, // The sender's address
          amount // The amount of Ether sent
        );
    });

    describe("Integration Tests", function () {
      it("Should handle multiple charities and donations correctly", async function () {
        const { ntoboa, donor, testData } = await loadFixture(
          deployMultipleCharitiesFixture
        );

        // Additional donations
        await ntoboa
          .connect(donor)
          .donate(0, { value: testData.largeDonationAmount });
        await ntoboa
          .connect(donor)
          .donate(1, { value: testData.donationAmount });

        // Verify balances
        expect(await ntoboa.getBalanceOf(0)).to.equal(
          testData.donationAmount + testData.largeDonationAmount
        );
        expect(await ntoboa.getBalanceOf(1)).to.equal(
          testData.largeDonationAmount + testData.donationAmount
        );
      });

      it("Should handle donation, withdrawal, and new donation cycle", async function () {
        const { ntoboa, owner, donor, testData } = await loadFixture(
          deployAndCreateCharityFixture
        );

        // Initial state
        expect(await ntoboa.getBalanceOf(0)).to.equal(testData.donationAmount);

        // Withdraw
        await ntoboa.connect(owner).withdraw(0);
        expect(await ntoboa.getBalanceOf(0)).to.equal(0);

        // New donation
        await ntoboa
          .connect(donor)
          .donate(0, { value: testData.largeDonationAmount });
        expect(await ntoboa.getBalanceOf(0)).to.equal(
          testData.largeDonationAmount
        );
      });
    });
  });
});
