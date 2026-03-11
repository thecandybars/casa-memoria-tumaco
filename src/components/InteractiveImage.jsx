import PropTypes from "prop-types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Fade,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { AddCircleOutlineIcon, ArrowBackIosNewOutlinedIcon } from "./icons";

export default function InteractiveImage({
  src,
  hotspots = [],
  // mainInfo = null,
}) {
  const [instance, setInstance] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showText, setShowText] = useState({
    visible: false,
    textBox: null,
    titulo: "",
  });
  const [showMainInfo, setShowMainInfo] = useState(true);

  const stageRef = useRef(null);

  // Cierra el hotspot activo y resetea el transform para recentrar la imagen.
  const closeHotspot = useCallback(() => {
    if (!showText.visible) return;

    setShowText({ visible: false, textBox: null, titulo: "" });
    instance?.resetTransform(300);
  }, [instance, showText.visible]);

  // Permite cerrar el hotspot con Escape.
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        closeHotspot();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [closeHotspot]);

  // Cuando cambia el tamaño de la ventana, resetea el transform.
  // Esto ayuda a mantener centrada la imagen y evita desajustes responsivos.
  useEffect(() => {
    if (!instance) return;

    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        instance.resetTransform(0);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [instance]);

  const renderHotspots = hotspots.map((hotspot) => (
    <Box
      key={hotspot.id}
      id={hotspot.id}
      onClick={(e) => {
        e.stopPropagation();

        // Hace zoom programático al hotspot seleccionado y abre su texto.
        if (instance) {
          instance.zoomToElement(hotspot.id, hotspot.zoom.amount || 3.5, 1000);
          setShowText({
            visible: true,
            textBox: { ...hotspot.textBox },
            titulo: hotspot.titulo,
          });
        }
      }}
      sx={{
        position: "absolute",
        top: hotspot.button.top,
        left: hotspot.button.left,
        width: 40,
        height: 40,
        borderRadius: "50%",
        cursor: "pointer",
        transform: "translate(-50%, -50%)",
        bgcolor: "#000000aa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <Tooltip title={!showText.visible ? hotspot.titulo : ""}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddCircleOutlineIcon sx={{ color: "white" }} size="large" />
        </Box>
      </Tooltip>
    </Box>
  ));

  const renderDialogZoomed = showText.textBox && (
    <Slide in={showText.visible} timeout={500} direction="up">
      <Stack
        gap={1}
        alignItems="flex-start"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "#000000aa",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "10px",
          width: "100%",
          zIndex: 1000,
          color: "white",
          textAlign: "left",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          {showText.titulo}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>
          {showText.textBox.content}
        </Typography>
      </Stack>
    </Slide>
  );

  return (
    <Box
      ref={stageRef}
      sx={{
        // Stage principal: ocupa toda la pantalla y recorta cualquier overflow.
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        centerOnInit
        onInit={(wrapper) => setInstance(wrapper)}
        wheel={{ disabled: true }}
        panning={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
      >
        {() => (
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
            contentStyle={{
              // Este contenedor centra visualmente la imagen dentro del viewport.
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              onClick={closeHotspot}
              sx={{
                // El padre relativo compartido entre imagen y hotspots:
                // esto garantiza que los hotspots queden alineados con la imagen.
                position: "relative",
                display: loaded ? "inline-block" : "none",
                lineHeight: 0,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <Box
                component="img"
                src={src}
                alt="Zoomable"
                onLoad={() => {
                  setLoaded(true);

                  // Una vez cargada la imagen, forzamos un reset para asegurar
                  // centrado correcto según el tamaño real ya renderizado.
                  requestAnimationFrame(() => {
                    instance?.resetTransform(0);
                  });
                }}
                sx={{
                  // La imagen se adapta al viewport sin desbordarse.
                  // La responsividad depende de CSS, no de cálculos manuales de width.
                  display: "block",
                  maxWidth: "100vw",
                  maxHeight: "100vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  userSelect: "none",
                  WebkitUserDrag: "none",
                }}
              />

              {/* Los hotspots solo se muestran cuando no hay uno abierto.
                  Permanecen alineados porque viven dentro del mismo contenedor transformado. */}
              <Fade in={!showText.visible && loaded} timeout={100}>
                <Box>{renderHotspots}</Box>
              </Fade>
            </Box>
          </TransformComponent>
        )}
      </TransformWrapper>

      {renderDialogZoomed}

      <Box
        sx={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: showText.visible ? 20 : 0,
          visibility: showText.visible ? "visible" : "hidden",
          opacity: showText.visible ? 1 : 0,
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Button
          sx={{
            borderRadius: "100%",
            width: "52px",
            aspectRatio: "1",
            bgcolor: "rgba(0,0,0,0.7)",
          }}
          onClick={closeHotspot}
        >
          <ArrowBackIosNewOutlinedIcon
            sx={{ fontSize: "18px", color: "white" }}
          />
        </Button>
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          right: 20,
        }}
      >
        <Button
          variant="text"
          sx={{
            borderRadius: "100%",
            width: "52px",
            aspectRatio: "1",
            bgcolor: "rgba(0,0,0,0.5)",
            textTransform: "none",
          }}
          onClick={() => setShowMainInfo(true)}
        >
          <Typography
            sx={{
              fontSize: "24px",
              color: "white",
              border: "1px solid white",
              borderRadius: "100%",
              padding: 3,
              width: "20px",
              height: "20px",
              aspectRatio: "1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ?
          </Typography>
        </Button>
      </Box>

      <Dialog
        open={showMainInfo}
        fullScreen
        onClose={() => setShowMainInfo(false)}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
        }}
      >
        <Stack
          direction="row"
          gap={12}
          mx={40}
          sx={{
            height: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <img src="/help.svg" alt="help" />
          <Stack gap={2}>
            <Typography
              sx={{
                fontSize: "32px",
                fontFamily: "Nunito",
              }}
            >
              RECORRE EL MURAL INTERACTIVO
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontFamily: "Nunito",
              }}
            >
              Haz clic en los puntos de información para conocer la historia y
              los detalles de cada sección. Navega a tu ritmo y explora
              libremente.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setShowMainInfo(false)}
              sx={{
                textTransform: "none",
                color: "white",
                border: "1px solid white",
                borderRadius: "50px",
                width: "200px",
                alignSelf: "center",
                mt: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontFamily: "Nunito",
                }}
              >
                Continuar
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Box>
  );
}

InteractiveImage.propTypes = {
  src: PropTypes.string,
  hotspots: PropTypes.array,
  zoom: PropTypes.number,
  mainInfo: PropTypes.object,
};
