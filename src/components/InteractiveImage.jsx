import PropTypes from "prop-types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Fade,
  Slide,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { CancelIcon, InfoOutlinedIcon, AddCircleOutlineIcon } from "./icons";

export default function InteractiveImage({
  src,
  hotspots = [],
  mainInfo = null,
}) {
  const [instance, setInstance] = useState(null);
  console.log("🚀 ~ instance:", instance);

  const [showText, setShowText] = useState({ visible: false, textBox: null });
  const [showMainInfo, setShowMainInfo] = useState(true);
  const [initialImageWidth, setInitialImageWidth] = useState(null);
  const [scaledWidth, setScaledWidth] = useState(null);

  const imageRef = useRef(null);

  useEffect(() => {
    const calculateInitialWidth = () => {
      if (imageRef.current) {
        const width = imageRef.current.clientWidth;
        setInitialImageWidth(width);
        setScaledWidth(width); // Set initial scaled width
      }
    };

    if (imageRef.current?.complete) {
      calculateInitialWidth();
    } else {
      imageRef.current?.addEventListener("load", calculateInitialWidth);
    }

    window.addEventListener("resize", calculateInitialWidth);

    return () => {
      window.removeEventListener("resize", calculateInitialWidth);
      imageRef.current?.removeEventListener("load", calculateInitialWidth);
    };
  }, []);

  const handleTransform = (context) => {
    const scale = context.state.scale;
    console.log("🚀 ~ handleTransform ~ scale:", scale);

    // Dynamically update the width of the container based on the zoom scale
    if (initialImageWidth) {
      setScaledWidth(initialImageWidth * scale);
    }
  };

  // Esto queda comentado para continuar desarrollando. La idea es hacer zoom no al hotspot sino a un elemento invisible en otra posicion
  // La idea es para implementar el zoom que alarga la imagen, sobre todo para imagenes verticales
  // const renderHotspotZoomElement = hotspots.map((hotspot) => (
  //   <div
  //     key={hotspot.id}
  //     id={`zoom-${hotspot.id}`}
  //     style={{
  //       position: "absolute",
  //       top: hotspot.zoom.top,
  //       left: hotspot.zoom.left,
  //       width: "40px",
  //       height: "40px",
  //       borderRadius: "50%",
  //       cursor: "pointer",
  //       transform: "translate(-50%, -50%)",
  //       backgroundColor: "red",
  //       border: "1px solid red",
  //     }}
  //   >
  //     {hotspot.id}
  //   </div>
  // ));

  const renderHotspots = hotspots.map((hotspot) => (
    <Box
      key={hotspot.id}
      onClick={() => {
        if (instance) {
          // instance.zoomToElement(
          //   `zoom-${hotspot.id}`,
          //   hotspot.zoom.amount || 3.5,
          //   1000
          // );
          instance.zoomToElement(hotspot.id, hotspot.zoom.amount || 3.5, 1000);

          setShowText({
            visible: true,
            textBox: { ...hotspot.textBox },
            titulo: hotspot.titulo,
          });
        }
      }}
      id={hotspot.id}
      sx={{
        position: "absolute",
        top: hotspot.button.top,
        left: hotspot.button.left,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: "pointer",
        transform: "translate(-50%, -50%)",
        backgroundColor: "secondary.main",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <Tooltip title={!showText.visible && hotspot.titulo}>
        <AddCircleOutlineIcon color="primary" size="large" />
      </Tooltip>
    </Box>
  ));

  const renderMainInfo = (
    <Fade in={!showText.visible} timeout={800}>
      <Box
        display="flex"
        sx={{
          position: "absolute",
          alignItems: "flex-end",
          gap: 1,
          bottom: 20,
          left: 20,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Box
          onClick={() => setShowMainInfo(!showMainInfo)}
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "all",
          }}
        >
          {showMainInfo ? (
            <CancelIcon size="large" color="primary" />
          ) : (
            <InfoOutlinedIcon size="large" color="primary" />
          )}
        </Box>
        <Slide in={showMainInfo} timeout={200} direction="up">
          <Stack
            gap={1}
            sx={{
              bgcolor: "rgba(0,0,0,0.8)",
              p: 1,
              width: "60%",
            }}
          >
            <Typography variant="h6">{mainInfo && mainInfo.title}</Typography>
            <Typography variant="body">
              {mainInfo && mainInfo.content}
            </Typography>
          </Stack>
        </Slide>
      </Box>
    </Fade>
  );

  const renderDialogZoomed = showText.textBox && (
    <Zoom
      in={showText.visible}
      style={{
        transitionDelay: showText.visible ? "800ms" : "0ms",
      }}
    >
      <Stack
        gap={1}
        sx={{
          position: "absolute",
          top: showText.textBox.top || "50%",
          left: showText.textBox.left || "50%",
          backgroundColor: "black",
          padding: "10px",
          width: "40%",
          borderRadius: "8px",
          zIndex: 1000,
          color: "white",
        }}
      >
        <Typography variant="h4"> {showText.titulo}</Typography>
        <Typography variant="body"> {showText.textBox.content}</Typography>
        <Button
          onClick={() => {
            setShowText({ visible: false, textBox: null, titulo: "" });
            instance.resetTransform(500);
          }}
        >
          Cerrar
        </Button>
      </Stack>
    </Zoom>
  );

  return (
    <div style={{ position: "relative", width: "auto" }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        centerOnInit
        onInit={(e) => setInstance(e)}
        onTransformed={handleTransform}
        wheel={{ disabled: true }}
        panning={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
      >
        {() => (
          <TransformComponent>
            <div
              style={{
                transformOrigin: "center", // Ensure scaling happens from the center
                display: "inline-block",
              }}
            >
              <img
                ref={imageRef}
                src={src}
                alt="Zoomable"
                style={{
                  width: scaledWidth,
                  height: "100vh",
                  objectFit: "cover",
                }}
              />
              <Fade in={!showText.visible} timeout={100}>
                <div>{renderHotspots}</div>
              </Fade>
              {/* {renderHotspotZoomElement} */}
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>
      {renderDialogZoomed}
      {renderMainInfo}
    </div>
  );
}

InteractiveImage.propTypes = {
  src: PropTypes.string,
  hotspots: PropTypes.array,
  zoom: PropTypes.number,
  mainInfo: PropTypes.object,
};
