// @DEPRECATED
import { Database } from "@tableland/sdk"
import { ethers } from 'ethers';

export const TABLE_NAME = 'cmtable_3515'

export type ROW_TYPE_PROMPT = {
  id: number,
  address: string,
  prompt: string,
  image: string,
}

export function useTableland() {
  const getConnection = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    console.log('dd', signer)

    // Connect to the Tableland testnet (defaults to Goerli testnet)
    // @return {Connection} Interface to access the Tableland network and target chain
    const tableland = new Database({ signer });
    return tableland
  }

  /* create event */
  const createPrompt = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const db = new Database({ signer });

    console.log('tt', db)
    const { meta: create } = await db.prepare(
      `CREATE TABLE ${TABLE_NAME} (id integer primary key, address text, prompt text, image text);`
    ).run();
    const { name } = create.txn!;
    console.log('ddddd', name)
    return name
  }

  const writeQueryOnPrompt = async (tableName: string, data: ROW_TYPE_PROMPT) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const db = new Database({ signer });

    const { meta: insert } = await db.prepare(`INSERT INTO ${tableName} (id, address, prompt, image) VALUES (${data.id}, '${data.address}', '${data.prompt}', '${data.image}');`).run();
    await insert.txn?.wait();
    return insert
  }

  const readQuery = async (tableName: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const db = new Database({ signer });

    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    return results
  }

  return { getConnection, createPrompt, writeQueryOnPrompt, readQuery }
}