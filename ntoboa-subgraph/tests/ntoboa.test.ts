import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CharityCreated } from "../generated/schema"
import { CharityCreated as CharityCreatedEvent } from "../generated/Ntoboa/Ntoboa"
import { handleCharityCreated } from "../src/ntoboa"
import { createCharityCreatedEvent } from "./ntoboa-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let name = "Example string value"
    let description = "Example string value"
    let target = BigInt.fromI32(234)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let newCharityCreatedEvent = createCharityCreatedEvent(
      id,
      name,
      description,
      target,
      owner
    )
    handleCharityCreated(newCharityCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CharityCreated created and stored", () => {
    assert.entityCount("CharityCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CharityCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "CharityCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "description",
      "Example string value"
    )
    assert.fieldEquals(
      "CharityCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "target",
      "234"
    )
    assert.fieldEquals(
      "CharityCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
