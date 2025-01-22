// user profiles
// charity profiles
// charity donations / transactions / withdrawals / and stats
// dashboard: new charity created, new witidrawals, combined charity stats, donation stats

import {
  CharityCreated as CharityCreatedEvent,
  DonationReceived as DonationReceivedEvent,
  EtherReceived as EtherReceivedEvent,
  WithdrawalMade as WithdrawalMadeEvent,
} from "../generated/Ntoboa/Ntoboa";
import {
  DonationReceived,
  EtherReceived,
  WithdrawalMade,
  User,
  Charity
} from "../generated/schema";
import { BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts";

// Constants for tracking donations
const RECENT_DONATIONS_COUNT = 10;
const TOP_DONATIONS_COUNT = 10;

function getOrCreateUser(userId: Bytes): User {
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.totalDonationsMade = BigInt.fromI32(0);
    user.totalDonationsReceived = BigInt.fromI32(0);
    user.totalCharitiesCreated = 0;
    user.totalCharitiesContributedTo = 0;
    user.highestDonation = BigInt.fromI32(0);
    user.averageDonation = BigDecimal.fromString("0");
    user.save();
  }
  return user;
}

function getOrCreateCharity(charityId: BigInt): Charity {
  let charity = Charity.load(charityId.toString());
  if (!charity) {
    charity = new Charity(charityId.toString());
    // charity.internal_id = charityId;
    charity.amountRaised = BigInt.fromI32(0);
    charity.totalDonations = 0;
    charity.highestDonation = BigInt.fromI32(0);
    charity.averageDonation = BigDecimal.fromString("0");
    charity.lastDonationTimestamp = BigInt.fromI32(0);
    charity.recentDonationIds = [];
    charity.largestDonationIds = [];
    charity.save();
  }
  return charity;
}

export function handleCharityCreated(event: CharityCreatedEvent): void {
  let charity = new Charity(event.params.id.toString());
  
  // charity.internal_id = event.params.id;
  charity.name = event.params.name;
  charity.description = event.params.description;
  charity.target = event.params.target;
  charity.owner = event.params.owner;
  charity.createdAtBlockNumber = event.block.number;
  charity.createdAtTimestamp = event.block.timestamp;
  charity.creationTxHash = event.transaction.hash;
  
  // Initialize statistics
  charity.amountRaised = BigInt.fromI32(0);
  charity.totalDonations = 0;
  charity.highestDonation = BigInt.fromI32(0);
  charity.averageDonation = BigDecimal.fromString("0");
  charity.lastDonationTimestamp = BigInt.fromI32(0);
  charity.recentDonationIds = [];
  charity.largestDonationIds = [];
  
  charity.save();

  let user = getOrCreateUser(event.params.owner);
  user.totalCharitiesCreated += 1;
  user.save();
}

export function handleDonationReceived(event: DonationReceivedEvent): void {
  let donationId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new DonationReceived(donationId);
  
  entity.charity = event.params.charityId.toString(); 
  entity.donor = event.params.donor; 
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update donor's profile
  let donor = getOrCreateUser(event.params.donor);
  donor.totalDonationsMade = donor.totalDonationsMade.plus(event.params.amount);

  if (donor.highestDonation.equals(BigInt.fromI32(0)) || event.params.amount.gt(donor.highestDonation)) {
    donor.highestDonation = event.params.amount;
  }

  let totalDonations = donor.totalDonationsMade;
  let totalContributions = donor.totalCharitiesContributedTo + 1;
  donor.averageDonation = totalDonations.toBigDecimal()
    .div(BigDecimal.fromString(totalContributions.toString()));

  donor.totalCharitiesContributedTo += 1;
  donor.save();

  // Update charity
  let charity = getOrCreateCharity(event.params.charityId);
  charity.amountRaised = charity.amountRaised.plus(event.params.amount);
  charity.totalDonations += 1;

  // Update highest donation
  if (charity.highestDonation.equals(BigInt.fromI32(0)) || event.params.amount.gt(charity.highestDonation)) {
    charity.highestDonation = event.params.amount;
  }

  // Update average donation
  let totalDonationsBigInt = BigInt.fromI32(charity.totalDonations);
  charity.averageDonation = charity.amountRaised.toBigDecimal()
    .div(totalDonationsBigInt.toBigDecimal());

  // Update last donation timestamp
  charity.lastDonationTimestamp = event.block.timestamp;

  // Update recent donations (keep last RECENT_DONATIONS_COUNT donations)
  let recentDonations = charity.recentDonationIds;
  recentDonations.unshift(donationId.toHexString());
  if (recentDonations.length > RECENT_DONATIONS_COUNT) {
    recentDonations = recentDonations.slice(0, RECENT_DONATIONS_COUNT);
  }
  charity.recentDonationIds = recentDonations;

  // Update largest donations
  let largestDonations = charity.largestDonationIds;
  let shouldAdd = largestDonations.length < TOP_DONATIONS_COUNT;
  
  if (!shouldAdd) {
    // Check if this donation is larger than the smallest in our top list
    let smallestTopDonation = DonationReceived.load(Bytes.fromHexString(largestDonations[largestDonations.length - 1]) as Bytes);
    if (smallestTopDonation && event.params.amount.gt(smallestTopDonation.amount)) {
      shouldAdd = true;
    }
  }

  if (shouldAdd) {
    largestDonations.push(donationId.toHexString());
    // Sort by amount in descending order
    largestDonations.sort((a, b)  => {
      let donationA = DonationReceived.load(Bytes.fromHexString(a) as Bytes);
      let donationB = DonationReceived.load(Bytes.fromHexString(b) as Bytes);
      if (!donationA || !donationB) return 0;
      return donationB.amount.minus(donationA.amount).toI32();
    });
    // Keep only top donations
    if (largestDonations.length > TOP_DONATIONS_COUNT) {
      largestDonations = largestDonations.slice(0, TOP_DONATIONS_COUNT);
    }
    charity.largestDonationIds = largestDonations;
  }

  charity.save();
}

export function handleEtherReceived(event: EtherReceivedEvent): void {
  let entity = new EtherReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleWithdrawalMade(event: WithdrawalMadeEvent): void {
  let entity = new WithdrawalMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.charity = event.params.charityId.toString();
  entity.owner = event.params.owner;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update owner's profile
  let owner = getOrCreateUser(event.params.owner);
  owner.totalDonationsReceived = owner.totalDonationsReceived.plus(event.params.amount);
  owner.save();

  // Note: Commented out charity amount adjustment as per original code
  // let charity = getOrCreateCharity(event.params.charityId);
  // if (event.params.amount.equals(charity.amountRaised)) {
  //   charity.amountRaised = BigInt.fromI32(0);
  // } else {
  //   charity.amountRaised = charity.amountRaised.minus(event.params.amount);
  // }
  // charity.save();
}