import type { FC } from "react";
import { Button, Flex, Typography } from "antd";
import { Link } from "react-router";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Something went wrong with the request. Please try again.",
  401: "You are not authorized. Please check your credentials.",
  403: "Access denied. You don't have permission to view this.",
  404: "We couldn't find what you were looking for.",
  408: "The request took too long. Please try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Our server is temporarily unavailable. Please try again later.",
  503: "Service is currently unavailable. Please try again later.",
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again later.";

type GenErrorMessageProps = {
  error: Error & { status?: number };
};

const GenErrorMessage: FC<GenErrorMessageProps> = ({ error }) => {
  const { Text } = Typography;

  return (
    <Flex vertical align="center" justify="center" gap={20} >
      <Text type="danger">
        {(error.status && STATUS_MESSAGES[error.status]) || DEFAULT_MESSAGE}
      </Text>
      <Link to="/">
        <Button className="custom-button" type="primary">
          Back to Home
        </Button>
      </Link>
    </Flex>

  );
};

export default GenErrorMessage;
