import { loadBalances, loadTransfers } from "../src/services/csvLoader";
import { applyTransfers } from "../src/services/transferService";
import { formatBalances, formatReport } from "../src/services/reportService";

function main(argv: string[]): void {
  const [balancesPath, transfersPath] = argv.slice(2);

  if (!balancesPath || !transfersPath) {
    console.error("Usage: run <balances.csv> <transfers.csv>");
    process.exit(1);
  }

  try {
    const bank = loadBalances(balancesPath);
    console.log(formatBalances(bank, "Loaded balances"));
    console.log();

    const transfers = loadTransfers(transfersPath);
    const results = applyTransfers(bank, transfers);
    console.log(formatReport(bank, results));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main(process.argv);
