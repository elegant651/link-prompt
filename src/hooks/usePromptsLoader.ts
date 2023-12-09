// import { chainToSupportedChainPromptTablelandTable } from "@/utils/chains";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import useError from "./useError";
import PromptEntity from "@/entities/PromptEntity";

export default function usePromptsLoader(args?: { minter?: string }): {
  prompts: PromptEntity[] | undefined;
} {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const [prompts, setPrompts] = useState<PromptEntity[] | undefined>();
  // const table = chainToSupportedChainPromptTablelandTable(chain);
  // console.log('t', table)

  useEffect(() => {
    setPrompts(undefined);

    // setPrompts([])

    // select data from table

    // Define statement
    // let statement = `select%20%2A%20from%20${table}%20order%20by%20minting_timestamp%20desc`;
    // if (args?.minter) {
    //   statement = `select%20%2A%20from%20${table}%20where%20minter%3D%22${args.minter.toLowerCase()}%22%20order%20by%20minting_timestamp%20desc`;
    // }
    // Make request
    // axios
    //   .get(
    //     `https://testnets.tableland.network/api/v1/query?statement=${statement}`
    //     // `http://localhost:8080/api/v1/query?statement=${statement}`
    //   )
    //   .then((data) => setPrompts(data.data))
    //   .catch((error) => {
    //     if (error?.response?.data?.message === "Row not found") {
    //       setPrompts([]);
    //     } else {
    //       handleError(error, true);
    //     }
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args?.minter]);

  return {
    prompts,
  };
}
