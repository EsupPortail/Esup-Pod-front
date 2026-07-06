import { Loader } from "@openfun/cunningham-react";

type CenteredLoaderProps = {
  minHeight?: string;
};

export default function CenteredLoader({
  minHeight = "50vh",
}: CenteredLoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
      }}
    >
      <Loader />
    </div>
  );
}
