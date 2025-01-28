import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NtoboaModule = buildModule("Ntoboa", (m) => {
  // Define contract version as a string
  const VERSION = "1.0.0";

  // Deploy contract with correct parameter typing
  const ntoboa = m.contract("Ntoboa", [], {
    id: `Ntoboa_1_0_0`, // Pass options like `id` in the third argument
  });

  return { ntoboa };
});

export default NtoboaModule;
