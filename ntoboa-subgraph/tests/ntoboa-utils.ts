import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CharityCreated,
  DonationReceived,
  EtherReceived,
  WithdrawalMade
} from "../generated/Ntoboa/Ntoboa"

export function createCharityCreatedEvent(
  id: BigInt,
  name: string,
  description: string,
  target: BigInt,
  owner: Address
): CharityCreated {
  let charityCreatedEvent = changetype<CharityCreated>(newMockEvent())

  charityCreatedEvent.parameters = new Array()

  charityCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  charityCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  charityCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  charityCreatedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromUnsignedBigInt(target))
  )
  charityCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return charityCreatedEvent
}

export function createDonationReceivedEvent(
  charityId: BigInt,
  donor: Address,
  amount: BigInt
): DonationReceived {
  let donationReceivedEvent = changetype<DonationReceived>(newMockEvent())

  donationReceivedEvent.parameters = new Array()

  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "charityId",
      ethereum.Value.fromUnsignedBigInt(charityId)
    )
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam("donor", ethereum.Value.fromAddress(donor))
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return donationReceivedEvent
}

export function createEtherReceivedEvent(
  sender: Address,
  amount: BigInt
): EtherReceived {
  let etherReceivedEvent = changetype<EtherReceived>(newMockEvent())

  etherReceivedEvent.parameters = new Array()

  etherReceivedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  etherReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return etherReceivedEvent
}

export function createWithdrawalMadeEvent(
  charityId: BigInt,
  owner: Address,
  amount: BigInt
): WithdrawalMade {
  let withdrawalMadeEvent = changetype<WithdrawalMade>(newMockEvent())

  withdrawalMadeEvent.parameters = new Array()

  withdrawalMadeEvent.parameters.push(
    new ethereum.EventParam(
      "charityId",
      ethereum.Value.fromUnsignedBigInt(charityId)
    )
  )
  withdrawalMadeEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawalMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalMadeEvent
}
