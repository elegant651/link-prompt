import usePromptsLoader from "@/hooks/usePromptsLoader";
import { Box, Typography } from "@mui/material";
import EntityList from "../entity/EntityList";
import PromptCard from "../prompt/PromptCard";
import PromptEntity from "@/entities/PromptEntity";

/**
 * A component with account prompts.
 */
export default function AccountPrompts(props: { address: string }) {
  const { prompts } = usePromptsLoader({ minter: props.address });

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        My Prompts
      </Typography>
      <EntityList
        entities={prompts}
        renderEntityCard={(prompt: PromptEntity, index) => (
          <PromptCard key={index} id={prompt.id} uri={prompt.uri} />
        )}
        noEntitiesText="😐 no prompts"
        sx={{ mt: 4 }}
      />
    </Box>
  );
}
