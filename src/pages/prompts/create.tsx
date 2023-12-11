import FormikHelper from "@/components/FormikHelper";
import Layout from "@/components/layout";
import { SearchCard } from "@/components/prompt/SearchCard";
import {
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "@/components/styled";
import { promptContractAbi } from "@/contracts/abi/promptContract";
import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useError from "@/hooks/useError";
import useIpfs from "@/hooks/useIpfs";
import useToasts from "@/hooks/useToast";
import { palette } from "@/theme/palette";
import {
  chainToSupportedChainId,
  chainToSupportedChainLitProtocolChain,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import { getImages } from "@/utils/genai";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Grid, MenuItem, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

const litClient = new LitJsSdk.LitNodeClient({ litNetwork: 'cayenne', });

/**
 * Page to create a prompt.
 */
export default function CreatePrompt() {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { handleError } = useError();
  const { uploadJsonToIpfs } = useIpfs();
  const { showToastSuccess, showToastError } = useToasts();
  const [litNodeClient, setLitNodeClient] = useState<
    LitJsSdk.LitNodeClient | undefined
  >();

  const [searchData, setSearchData] = useState<any>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    title: "Amazon SEO prompt",
    prompt: "",
  });
  const formValidationSchema = yup.object({
    title: yup.string().required(),
    prompt: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [submittedFormDataUri, setSubmittedFormDataUri] = useState("");

  /**
   * Contract states
   */
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainPromptContractAddress(chain),
    abi: promptContractAbi,
    functionName: "mint",
    args: [submittedFormDataUri],
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

  // const selectImage = (url: string) => {
  //   console.log('imgUrl', url)
  //   setSelectedImage(url)
  // }

  // async function searchImage(values: any) {
  //   try {
  //     setIsSearchLoading(true);
  //     const images = await getImages(values.prompt)
  //     setSearchData(images)
  //   } catch (error: any) {
  //     handleError(error, true);
  //   } finally {
  //     setIsSearchLoading(false);
  //   }
  // }

  useEffect(() => {
    if (contractWriteData?.hash) {
      console.log('hash', contractWriteData?.hash)
    }
  }, [contractWriteData])

  /**
   * Submit form values.
   */
  async function submitForm(values: any) {
    try {
      setIsFormSubmitting(true);
      // Define params
      const author = address;
      const created = new Date().getTime();
      // Upload prompt to lit protocol
      const { encryptedString, encryptedSymmetricKey } =
        await uploadPromptToLitProtocol(values.prompt);
      // const encryptedString = 'encryptedString'
      // const encryptedSymmetricKey = 'encryptedSymmetricKey'

      console.log('d', encryptedString + "/" + encryptedSymmetricKey)

      // Upload prompt uri data to ipfs
      const promptUriData: PromptUriDataEntity = {
        author: author,
        created: created,
        title: values.title,
        prompt: values.prompt,
        promptEncryptedString: encryptedString,
        promptEncryptedSymmetricKey: encryptedSymmetricKey,
        // imageUrl: selectedImage
      };
      const { uri } = await uploadJsonToIpfs(promptUriData);

      console.log('uri', uri)
      setSubmittedFormDataUri(uri);

    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }


  /**
  * Upload prompt to lit protocol.
  */
  async function uploadPromptToLitProtocol(prompt: string) {
    if (!litNodeClient) {
      throw new Error("Lit Protocol is not ready");
    }
    const accessControlConditions = [
      {
        contractAddress: chainToSupportedChainPromptContractAddress(chain),
        standardContractType: "ERC721",
        chain: chainToSupportedChainLitProtocolChain(chain) || "",
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: chainToSupportedChainLitProtocolChain(chain) || "",
    });
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        authSig,
        chain: chainToSupportedChainLitProtocolChain(chain) || "",
        dataToEncrypt: prompt,
      },
      litClient
    );

    return {
      encryptedString: ciphertext,
      encryptedSymmetricKey: dataToEncryptHash,
    };
  }

  /**
   * Init lit node client
   */
  useEffect(() => {
    if (!litNodeClient) {
      litClient
        .connect()
        .then(() => {
          setLitNodeClient(litClient);
        })
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Write data to contract if form was submitted
   */
  useEffect(() => {
    if (submittedFormDataUri && contractWrite && !isContractWriteLoading) {
      contractWrite?.();
      setSubmittedFormDataUri("");
    }
  }, [submittedFormDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess(
        "Prompt is created and will appear soon on your account page"
      );
      router.push(`/accounts/${address}`);
      setIsFormSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransactionSuccess]);


  /**
   * Form states
   */
  const isFormLoading =
    isFormSubmitting ||
    Boolean(submittedFormDataUri) ||
    isContractWriteLoading ||
    isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmittingDisabled = isFormDisabled || !contractWrite;

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        Create a prompt
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submitForm}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />

            <WidgetBox bgcolor={palette.purpleDark} mt={2}>
              <WidgetTitle>Title</WidgetTitle>
              <WidgetInputTextField
                id="title"
                name="title"
                placeholder=""
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>

            {/* Prompt input */}
            <WidgetBox bgcolor={palette.greyDark} mt={2}>
              <WidgetTitle>Prompt</WidgetTitle>
              <WidgetInputTextField
                id="prompt"
                name="prompt"
                placeholder=""
                value={values.prompt}
                onChange={handleChange}
                error={touched.prompt && Boolean(errors.prompt)}
                helperText={touched.prompt && errors.prompt}
                disabled={isFormDisabled}
                multiline
                maxRows={8}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* <ExtraLargeLoadingButton
              loading={isSearchLoading}
              variant="outlined"
              disabled={isSearchLoading}
              sx={{ mt: 2, mb: 2 }}
              onClick={() => searchImage(values)}
            >
              Search Prompt
            </ExtraLargeLoadingButton> */}

            {/* {!selectedImage ?
              <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
                {searchData.map((obj, index) => (
                  <Grid item xs={4} key={index}>
                    <SearchCard url={obj.url} onClick={() => selectImage(obj.url)} />
                  </Grid>
                ))}
              </Grid>
              :
              <SearchCard url={selectedImage} />
            } */}


            {/* Submit button */}
            <ExtraLargeLoadingButton
              loading={isFormLoading}
              variant="outlined"
              type="submit"
              sx={{ mt: 2, mb: 4 }}
              disabled={isFormSubmittingDisabled}
            >
              Submit
            </ExtraLargeLoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
