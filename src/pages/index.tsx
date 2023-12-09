import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import PromptCard from "@/components/prompt/PromptCard";
import { LargeLoadingButton } from "@/components/styled";
import usePromptsLoader from "@/hooks/usePromptsLoader";
import PromptEntity from "@/entities/PromptEntity";
import { Box, Container, Stack, SxProps, Typography } from "@mui/material";

export default function Landing() {
  return (
    <Layout maxWidth={false} disableGutters={true}>
      <HeaderSection sx={{ mt: { md: 4 } }} />
      <QuoteSection />
      <PromptsSection sx={{ mt: { xs: 6, md: 12 }, mb: 12 }} />
    </Layout>
  );
}

function HeaderSection(props: { sx?: SxProps }) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Typography variant="h2" textAlign="center" color='#FF6600'>
        <strong>A decentralized image prompt marketplace</strong>
      </Typography>
      <Typography
        color="#444648"
        textAlign="center"
        mt={2}
        maxWidth={580}
      >
        where users can buy and sell prompts for AI image generators
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={4} mb={8}>
        <LargeLoadingButton href="/#prompts" variant="contained">
          Find a prompt
        </LargeLoadingButton>
        <LargeLoadingButton href="/prompts/create" variant="outlined">
          Sell a prompt
        </LargeLoadingButton>
      </Stack>
    </Container>
  );
}

function QuoteSection(props: { sx?: SxProps }) {
  return (
    <Box
      width={1}
      py={{ xs: 6, md: 6 }}
      sx={{ backgroundColor: "#ff983f", ...props.sx }}
    >
      <Container maxWidth="md" sx={{ color: "#ffffa1", textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} mt={4}>
          Buy and sell prompts for AI image generators, and create art that you never thought possible in Web3 world.
        </Typography>
        <Typography fontWeight={700} mt={4}>
          — Kate
        </Typography>
      </Container>
    </Box>
  );
}

function PromptsSection(props: { sx?: SxProps }) {
  const { prompts } = usePromptsLoader();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Box
        id="prompts"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-98px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h4" fontWeight={700} textAlign="center">
        Prompts
      </Typography>
      <Typography textAlign="center" mt={1}>
        You can find the prompt what you want.
      </Typography>
      <EntityList
        entities={prompts}
        renderEntityCard={(prompt: PromptEntity, index) => (
          <PromptCard key={index} id={prompt.id} uri={prompt.uri} />
        )}
        noEntitiesText="😐 no prompts"
        sx={{ mt: 4 }}
      />
    </Container>
  );
}
