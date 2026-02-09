import { forwardRef } from "react";
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
} from "react-native";

type AppTextProps = TextProps & { className?: string };
type AppTextInputProps = TextInputProps & { className?: string };

const StyledText = forwardRef<RNText, AppTextProps>(
  ({ className, ...props }, ref) => (
    <RNText ref={ref} className={className} {...props} />
  ),
);

const StyledTextInput = forwardRef<RNTextInput, AppTextInputProps>(
  ({ className, ...props }, ref) => (
    <RNTextInput ref={ref} className={className} {...props} />
  ),
);

StyledText.displayName = "StyledText";
StyledTextInput.displayName = "StyledTextInput";

export const Text = forwardRef<RNText, AppTextProps>(
  ({ style, ...props }, ref) => (
    <StyledText
      ref={ref}
      {...props}
      style={[{ fontFamily: "GoogleSans" }, style]}
    />
  ),
);

Text.displayName = "AppText";

export const TextInput = forwardRef<RNTextInput, AppTextInputProps>(
  ({ style, ...props }, ref) => (
    <StyledTextInput
      ref={ref}
      {...props}
      style={[{ fontFamily: "GoogleSans" }, style]}
    />
  ),
);

TextInput.displayName = "AppTextInput";
