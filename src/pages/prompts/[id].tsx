import AccountAvatar from "@/components/account/AccountAvatar";
import AccountLink from "@/components/account/AccountLink";
import FormikHelper from "@/components/FormikHelper";
import PromptBuyDialog from "@/components/prompt/PromptBuyDialog";
import PromptSellDialog from "@/components/prompt/PromptSellDialog";
import PromptShowDialog from "@/components/prompt/PromptShowDialog";
import {
  CardBox,
  FullWidthSkeleton,
  LargeLoadingButton,
  WidgetBox,
  WidgetContentBox,
  WidgetInputTextField,
  WidgetText,
  WidgetTitle,
} from "@/components/styled";
import { DialogContext } from "@/context/dialog";
import { profileContractAbi } from "@/contracts/abi/profileContract";
import { promptContractAbi } from "@/contracts/abi/promptContract";
import ProfileUriDataEntity from "@/entities/uri/ProfileUriDataEntity";
import PromptUriDataEntity from "@/entities/uri/PromptUriDataEntity";
import useError from "@/hooks/useError";
import useListingLoader from "@/hooks/useListingLoader";
import useUriDataLoader from "@/hooks/useUriDataLoader";
import { palette } from "@/theme/palette";
import { isAddressesEqual } from "@/utils/addresses";
import {
  chainToSupportedChainNativeCurrencySymbol,
  chainToSupportedChainProfileContractAddress,
  chainToSupportedChainPromptContractAddress,
} from "@/utils/chains";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import Layout from "@/components/layout";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { stringToAddress, timestampToLocaleDateString } from "@/utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import * as yup from "yup";
import MintNFTDialog from "@/components/nft/MintNFTDialog";
import { makeRequest } from "@/utils/chainlink";

/**
 * Page with a prompt.
 */
export default function Prompt() {
  const router = useRouter();
  const { id } = router.query;
  const { chain } = useNetwork();

  /**
   * Define prompt owner
   */
  const { data: promptOwner } = useContractRead({
    address: chainToSupportedChainPromptContractAddress(chain),
    abi: promptContractAbi,
    functionName: "ownerOf",
    args: [BigInt(id?.toString() || 0)],
    enabled: id !== undefined,
  });

  /**
   * Define prompt uri data
   */
  const { data: promptUri } = useContractRead({
    address: chainToSupportedChainPromptContractAddress(chain),
    abi: promptContractAbi,
    functionName: "tokenURI",
    args: [BigInt(id?.toString() || 0)],
    enabled: id !== undefined,
  });
  const { data: promptUriData } =
    useUriDataLoader<PromptUriDataEntity>(promptUri);

  return (
    <Layout maxWidth="sm">
      {id && promptOwner && promptUriData ? (
        <>
          <PromptData
            promptId={id.toString()}
            promptOwner={promptOwner}
            promptUriData={promptUriData}
          />
          {/* <ThickDivider sx={{ mt: 8, mb: 8 }} /> */}
          <Box mt='25px'></Box>

          <PromptSandbox promptUriData={promptUriData} />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function PromptData(props: {
  promptId: string;
  promptOwner: string;
  promptUriData: PromptUriDataEntity;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { showDialog, closeDialog } = useContext(DialogContext);

  /**
   * Define author data
   */
  const { data: promptAuthorProfileUri } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [
      stringToAddress(props.promptUriData.author) ||
      ethers.constants.AddressZero,
    ],
  });
  const { data: promptAuthorProfileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(promptAuthorProfileUri);

  /**
   * Define owner data
   */
  const { data: promptOwnerProfileUri } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [stringToAddress(props.promptOwner) || ethers.constants.AddressZero],
  });
  const { data: promptOwnerProfileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(promptOwnerProfileUri);

  /**
   * Define listing
   */
  const { listing: promptListing } = useListingLoader(props.promptId);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight={700} textAlign="center">
        {props.promptUriData.title} - #{props.promptId}
      </Typography>
      {/* Author */}
      <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>Author</WidgetTitle>
        <WidgetContentBox
          display="flex"
          gap={1}
          alignItems="center"
        >
          <AccountAvatar
            account={props.promptUriData.author || ethers.constants.AddressZero}
            accountProfileUriData={promptAuthorProfileUriData}
          />
          <AccountLink
            account={props.promptUriData.author || ethers.constants.AddressZero}
            accountProfileUriData={promptAuthorProfileUriData}
            sx={{ mt: 1 }}
          />
        </WidgetContentBox>
      </WidgetBox>
      {/* Owner */}
      <WidgetBox bgcolor={palette.greyLight} mt={2}>
        <WidgetTitle>Owner</WidgetTitle>
        <WidgetContentBox
          display="flex"
          gap={1}
          alignItems="center"
        >
          <AccountAvatar
            account={props.promptOwner}
            accountProfileUriData={promptOwnerProfileUriData}
          />
          <AccountLink
            account={props.promptOwner}
            accountProfileUriData={promptOwnerProfileUriData}
            sx={{ mt: 1 }}
          />
        </WidgetContentBox>
      </WidgetBox>
      {/* Image */}
      {/* <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>Image</WidgetTitle>
        <WidgetContentBox
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <img
            src={props.promptUriData.imageUrl}
            alt={props.promptUriData.title}
            loading="lazy"
            style={{ maxWidth: "100%", maxHeight: 400 }}
          />
        </WidgetContentBox>
      </WidgetBox> */}
      {/* Created */}
      <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>Created at</WidgetTitle>
        <WidgetText>
          {timestampToLocaleDateString(props.promptUriData.created, true)}
        </WidgetText>
      </WidgetBox>
      {/* Price */}
      {promptListing && (
        <WidgetBox bgcolor={palette.orange} mt={2}>
          <WidgetTitle>Price</WidgetTitle>
          <Stack direction="row" spacing={1}>
            <WidgetText>{promptListing.price}</WidgetText>
            <WidgetText>
              {chainToSupportedChainNativeCurrencySymbol(chain)}
            </WidgetText>
          </Stack>
        </WidgetBox>
      )}
      {/* Buttons */}
      <Stack direction="column" spacing={2} mt={2}>
        {!isAddressesEqual(address, props.promptOwner) && (
          <LargeLoadingButton
            variant="contained"
            // disabled={!Boolean(promptListing)}
            onClick={() => {
              if (promptListing) {
                showDialog?.(
                  <PromptBuyDialog
                    id={props.promptId}
                    listingPrice={promptListing.price}
                    listingMarketplaceId={promptListing.marketplaceId}
                    onClose={closeDialog}
                  />
                );
              }
            }}
          >
            Buy Prompt
          </LargeLoadingButton>
        )}
        {isAddressesEqual(address, props.promptOwner) && (
          <LargeLoadingButton
            variant="contained"
            disabled={Boolean(promptListing)}
            onClick={() =>
              showDialog?.(
                <PromptSellDialog id={props.promptId} onClose={closeDialog} />
              )
            }
          >
            Sell Prompt
          </LargeLoadingButton>
        )}
        {isAddressesEqual(address, props.promptOwner) && (
          <LargeLoadingButton
            variant="outlined"
            onClick={() =>
              showDialog?.(
                <PromptShowDialog
                  id={props.promptId}
                  uriData={props.promptUriData}
                  onClose={closeDialog}
                />
              )
            }
          >
            Show Prompt
          </LargeLoadingButton>
        )}
        {/* {isAddressesEqual(address, props.promptOwner) && (
          <LargeLoadingButton
            variant="outlined"
            onClick={() =>
              showDialog?.(
                <MintNFTDialog
                  id={props.promptId}
                  prompt={props.promptUriData.prompt}
                  // imageUrl={props.promptUriData.imageUrl}
                  onClose={closeDialog}
                />
              )
            }
          >
            Mint NFT
          </LargeLoadingButton>
        )} */}
      </Stack>
    </Box>
  );
}

function PromptSandbox(props: { promptUriData: PromptUriDataEntity }) {
  interface Message {
    role: "system" | "assistant" | "user";
    content: string;
  }

  const { handleError } = useError();
  const [messages, setMessages] = useState<Message[] | undefined>();

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    message: "",
  });
  const formValidationSchema = yup.object({
    message: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // useEffect(() => {
  //   if (props.promptUriData) {
  //     setMessages([
  //       {
  //         role: "user",
  //         content: props.promptUriData.prompt!
  //       }
  //     ])
  //   }
  // }, [props.promptUriData])

  /**
   * Send message to chat gpt and get response.
   */
  async function submitForm(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      // if (!messages) {
      //   throw new Error("System messages are not defined");
      // }

      try {
        await makeRequest()
      } catch (e) {
        console.error(e)
      }

      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: props.promptUriData.prompt! }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_OPEN_AI_KEY,
          },
        }
      );
      setMessages([
        { role: "user", content: values.message },
        data.choices?.[0]?.message,
      ]);

      actions?.resetForm();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        Sandbox
      </Typography>
      <Typography textAlign="center" mt={1}>
        to try the prompt
      </Typography>
      <>
        {/* Form */}
        <Formik
          initialValues={formValues}
          // validationSchema={formValidationSchema}
          onSubmit={submitForm}
        >
          {({ values, errors, touched, handleChange, setValues }) => (
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormikHelper
                onChange={(values: any) => setFormValues(values)}
              />
              {/* Message input */}
              {/* <WidgetBox bgcolor={palette.yellow} mt={2}>
                  <WidgetTitle>Message</WidgetTitle>
                  <WidgetInputTextField
                    id="message"
                    name="message"
                    placeholder="How can you help me?"
                    value={values.message}
                    onChange={handleChange}
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                    disabled={isFormSubmitting}
                    multiline
                    maxRows={4}
                    sx={{ width: 1 }}
                  />
                </WidgetBox> */}
              {/* Submit button */}
              <LargeLoadingButton
                loading={isFormSubmitting}
                variant="outlined"
                type="submit"
                disabled={isFormSubmitting}
                sx={{ mt: 2 }}
              >
                Try it
              </LargeLoadingButton>
            </Form>
          )}
        </Formik>
        {/* Messages */}
        {messages ? (
          <Box width={1} mt={2}>
            {messages
              .slice(0)
              .reverse()
              .map((message, index) => {
                if (message.role === "system") {
                  return <Box key={index} />;
                }
                return (
                  <CardBox key={index} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        sx={{
                          background:
                            message.role === "assistant"
                              ? palette.blue
                              : palette.yellow,
                        }}
                      >
                        <Typography fontSize={18}>
                          {message.role === "assistant" ? "🤖" : "👤"}
                        </Typography>
                      </Avatar>
                      <Typography>{message.content}</Typography>
                    </Stack>
                  </CardBox>
                );
              })}
          </Box>
        ) : <></>}
      </>
    </Box>
  );
}
