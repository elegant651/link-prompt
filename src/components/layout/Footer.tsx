import { palette } from "@/theme/palette";
import { Box, SxProps, Typography } from "@mui/material";
import { Container } from "@mui/system";

/**
 * Component with a footer.
 */
export default function Footer(props: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: '#ff983f',
        mt: 12,
        ...props.sx,
      }}
    >
      <Copyright />
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container maxWidth="md" sx={{ my: 3, ...props.sx }}>
      <Typography
        color="#ffffa1"
        fontWeight={700}
        textAlign="center"
      >
        BiPrompt © 2023
      </Typography>
    </Container>
  );
}
