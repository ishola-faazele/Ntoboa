import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NtoboaModule = buildModule("Ntoboa", (m) => {
  const ntoboa = m.contract("Ntoboa");

  return { ntoboa };
});

export default NtoboaModule
