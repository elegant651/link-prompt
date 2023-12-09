import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import {
  Box,
  BoxProps,
  DialogContent,
  Divider,
  DividerProps,
  Link,
  LinkProps,
  Select,
  SelectProps,
  Skeleton,
  SkeletonProps,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
  DialogContentProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const ThickDivider = styled(Divider)<DividerProps>(({ theme }) => ({
  width: "100%",
  borderBottomWidth: 5,
}));

export const FullWidthSkeleton = styled(Skeleton)<SkeletonProps>(
  ({ theme }) => ({
    width: "100%",
    height: "64px",
  })
);

export const CenterBoldText = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    textAlign: "center",
    fontWeight: 700,
    padding: "0 18px",
  })
);

export const ExtraLargeLoadingButton = styled(
  LoadingButton
)<LoadingButtonProps>(({ theme, variant }) => ({
  fontSize: "24px",
  fontWeight: 700,
  borderRadius: "8px",
  background: '#FF6600',
  color: '#ffffa1',
  padding: "12px 30px",
  ...(variant === "outlined" && {
    border: "5px solid",
    "&:hover": {
      border: "5px solid",
      background: '#ff983f',
    },
  }),
})) as typeof LoadingButton;

export const LargeLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  ({ theme, variant }) => ({
    fontSize: "18px",
    fontWeight: 700,
    background: '#FF6600',
    color: '#ffffa1',
    borderRadius: "8px",
    padding: "14px 48px",
    ...(variant === "outlined" && {
      border: "4px solid",
      "&:hover": {
        border: "4px solid",
        background: '#ff983f',
      },
    }),
  })
) as typeof LoadingButton;

export const MediumLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  ({ theme, variant }) => ({
    fontSize: "14px",
    fontWeight: 700,
    borderRadius: "24px",
    padding: "8px 18px",
    ...(variant === "outlined" && {
      border: "4px solid",
      "&:hover": {
        border: "4px solid",
      },
    }),
  })
) as typeof LoadingButton;

export const CardBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  backgroundColor: "#F5F5F5",
  border: "solid",
  borderColor: theme.palette.divider,
  borderWidth: "2px",
  borderRadius: "10px",
  padding: "18px 24px",
}));

export const WidgetBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "4px 16px",
  background: '#f5f5f5',
  border: '1px solid #cccccc',
  borderRadius: "6px",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

export const WidgetTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: '#444648',
  fontSize: "1.2rem",
  fontWeight: 700,
  minWidth: "0px",
  marginRight: "0px",
  marginBottom: "8px",
  [theme.breakpoints.up("md")]: {
    fontSize: "1.4rem",
    minWidth: "180px",
    marginRight: "24px",
    marginBottom: "0px",
  },
}));

export const WidgetContentBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "14px 20px",
}));

export const WidgetLink = styled(Link)<LinkProps>(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "14px 20px",
}));

export const WidgetText = styled(Typography)<TypographyProps>(({ theme }) => ({
  padding: "14px 10px",
}));

export const WidgetInputTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    width: "120px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "0px",
        borderRadius: "12px",
      },
      "&:hover fieldset": {
        border: "4px solid #000000",
      },
      "&.Mui-focused fieldset": {
        border: "4px solid #000000",
      },
    },
  })
);

export const WidgetInputSelect = styled(Select)<SelectProps>(({ theme }) => ({
  width: "120px",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "4px solid #000000",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "4px solid #000000",
  },
}));

export const DialogCenterContent = styled(DialogContent)<DialogContentProps>(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "14px 0px",
  })
);
