import { nftContractAbi } from "@/contracts/abi/nftContract";
import useToasts from "@/hooks/useToast";
import {
  chainToSupportedChainId,
  chainToSupportedChainNFTContractAddress,
  chainToSupportedChainMarketplaceContractAddress,
} from "@/utils/chains";
import { Dialog, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
} from "../styled";

/**
 * Dialog to buy a prompt.
 */
export default function MintNFTDialog(props: {
  id: string;
  prompt: string;
  // imageUrl: string;
  isClose?: boolean;
  onClose?: Function;
}) {
  const router = useRouter();

  const { switchNetwork } = useSwitchNetwork()
  const { showToastSuccess, showToastError } = useToasts();
  const [isOpen, setIsOpen] = useState(!props.isClose);
  const { chain } = useNetwork();

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Contract states
   */
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: '0x4e5B1c408CD8FA2efC2666bEd0cF3b814B1e2822',
      abi: nftContractAbi,
      functionName: "mint",
      args: [
        "NFT #" + props.id,
        props.prompt,
        '' // props.imageUrl,
      ],
      chainId: chainToSupportedChainId(chain),
      onError(error: any) {
        showToastError(error);
      },
    });

  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Mint NFT!");
      router.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransactionSuccess]);

  const clickHandler = async () => {
    // await switchNetwork?.((534351)); // scroll testnet
    contractWrite?.();
  }

  /**
   * Form states
   */
  const isFormLoading = isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmittingDisabled =
    isFormDisabled ||
    isTransactionSuccess ||
    isContractPrepareError ||
    !contractWrite;

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          Mint NFT #{props.id}
        </Typography>
        <ExtraLargeLoadingButton
          loading={isFormLoading}
          variant="outlined"
          type="submit"
          disabled={isFormSubmittingDisabled}
          onClick={() => { clickHandler() }}
          sx={{ mt: 2 }}
        >
          Minting
        </ExtraLargeLoadingButton>
      </DialogCenterContent>
    </Dialog>
  );
}
