import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { imagedataToSVG } from 'imagetracerjs';
import { useEffect, useState } from 'react';
import * as Icons from '@mui/icons-material';
import FontFaceObserver from 'fontfaceobserver';

const fonts = [
  'Poppins',
  'Pacifico',
  'Satisfy',
  'Great Vibes',
  'Sacreamento',
  'Sriracha',
  'Bebas Neue',
  'Lobster',
  'Kablammo',
];

const woods = [
  'https://th.bing.com/th/id/OIP.9pwzuXW2uqXDRGlprS7wYAHaE8?w=274&h=183&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.tg-Tp4w2x0A8Q2FDK2FP9gHaE8?w=258&h=180&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.fiDIlxFK5jc1r0R_xhp5rAHaFj?w=259&h=194&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.jN1XzePClQk2dSh5uWQCIgHaFj?w=259&h=194&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.HGidIMtJr5Kbrmb9viB39AHaEK?w=333&h=187&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.2iQmLO2uFRGalOeIQffouQHaHa?w=204&h=204&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.hZJpWGUCydcNtdII1AZbLQHaFh?w=242&h=180&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.KiGPGo06xxYRz7Bd-4tPSQHaHa?w=180&h=180&c=7&r=0&o=5&pid=1.7',
  'https://th.bing.com/th/id/OIP.bWZoBou5Mvfp5aIaqVqVOQHaFi?w=248&h=186&c=7&r=0&o=5&pid=1.7',
];

const addSVGStringToCanvas = (svgString, canvas) => {
  fabric.loadSVGFromString(svgString, (objects, options) => {
    const group = new fabric.Group(objects);
    objects.forEach((object) => {
      object.set({ fill: 'transparent', stroke: 'black' });
    });
    canvas.add(group);
  });
};

function convertURIToImageData(URI) {
  return new Promise(function (resolve, reject) {
    if (URI == null) return reject();
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      image = new Image();
    image.addEventListener(
      'load',
      function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false
    );
    image.src = URI;
  });
}

function applyPattern(url, shape, patternArea = 'stroke', canvas) {
  fabric.Image.fromURL(
    url,
    function (img) {
      const pattern = new fabric.Pattern({
        source: img._element,
        repeat: 'repeat',
        scaleWithObject: false,
      });
      pattern.scaleX = 10;
      pattern.scaleY = 10;

      shape.set(patternArea, pattern);
      canvas.renderAll();
    },
    {
      crossOrigin: 'anonymous',
    }
  );
}

const loadAndUse = (font, canvas) => {
  const myFont = new FontFaceObserver(font);
  myFont
    .load()
    .then(function () {
      // when font is loaded, use it.
      canvas.getActiveObject().set('fontFamily', font);
      canvas.requestRenderAll();
    })
    .catch(function (e) {
      console.log(e);
      alert('font loading failed ' + font);
    });
};

const Canvas = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [padding, setPadding] = useState(50);
  const [color, setColor] = useState();

  useEffect(() => {
    console.log('ready');
  }, [onReady]);

  const deleteObject = () => {
    editor?.canvas.getActiveObjects().forEach((object) => {
      editor?.canvas.remove(object);
    });
  };

  const duplicateObject = () => {
    editor?.canvas.getActiveObjects().forEach((object) => {
      object.clone((clone) => {
        console.log(object.left);
        const transform = object.calcTransformMatrix();
        editor?.canvas.add(clone);
      });
    });
  };

  editor?.canvas.setHeight('800');
  editor?.canvas.setWidth('800');

  const addText = () => {
    const newText = new fabric.IText('Test Text', {
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      paintFirst: 'stroke',
      strokeWidth: padding,
      fill: 'white',
      strokeUniform: true,
      strokeMiterLimit: 100,
      fillRule: 'even',
    });
    newText.on('modified', function () {
      newText.set({
        width: newText.width * newText.scaleX,
        scaleX: 1,
        height: newText.height * newText.scaleY,
        scaleY: 1,
        fontSize: newText.fontSize * newText.scaleY,
        strokeWidth: newText.strokeWidth * newText.scaleY,
      }); // apply the scale
      newText.setCoords(); // called so that the bounding box etc gets updated
    });
    applyPattern(
      'https://th.bing.com/th?id=OIP.U50enectlTS59a1Ky8rkdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
      newText,
      'stroke',
      editor?.canvas
    );
    editor?.canvas.add(newText);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({ radius: 50 });

    editor?.canvas.add(circle);
    circle.on('modified', function () {
      circle.set({
        radius: circle.radius * circle.scaleX,
        scaleX: 1,
        scaleY: 1,
      }); // apply the scale
      circle.setCoords(); // called so that the bounding box etc gets updated
    });

    applyPattern(
      'https://th.bing.com/th?id=OIP.U50enectlTS59a1Ky8rkdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
      circle,
      'fill',
      editor?.canvas
    );
  };

  const addRect = () => {
    const rect = new fabric.Rect({ width: 150, height: 80 });

    editor?.canvas.add(rect);
    rect.on('modified', function () {
      rect.set({
        width: rect.width * rect.scaleX,
        scaleX: 1,
        height: rect.height * rect.scaleY,
        scaleY: 1,
      }); // apply the scale
      rect.setCoords(); // called so that the bounding box etc gets updated
    });

    applyPattern(
      'https://th.bing.com/th?id=OIP.U50enectlTS59a1Ky8rkdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
      rect,
      'fill',
      editor?.canvas
    );
  };

  const moveForward = () =>
    editor?.canvas.getActiveObjects().forEach((object) => {
      object.bringForward(true);
    });

  const moveBackward = () =>
    editor?.canvas.getActiveObjects().forEach((object) => {
      object.sendBackwards(true);
    });

  const setFont = (font) => {
    loadAndUse(font, editor?.canvas);
  };

  const changeWood = (wood) => {
    editor?.canvas.getActiveObjects().forEach((object) => {
      applyPattern(wood, object, object.isType('i-text') ? 'stroke' : 'fill', editor?.canvas);
    });
  };

  const rasterize = () => {
    let cutout = undefined;
    editor?.canvas.clone((clone) => {
      cutout = clone;

      cutout._objects.forEach((object) => {
        object.set('fill', 'black');
        object.set('stroke', 'black');
      });
      cutout.set('backgroundColor', 'transparent');
      cutout.renderAll();
      const dataUrl = cutout.toDataURL({ format: 'png' });
      convertURIToImageData(dataUrl).then(function (imageData) {
        const svgString = imagedataToSVG(imageData, {
          ltres: 1,
          qtres: 1,
          pathomit: 70,
          rightangleenhance: false,
          blurradius: 0.2,
          blurdelta: 2,
          linefilter: true,
          scale: 1,
        });
        console.log({ svgString });

        addSVGStringToCanvas(svgString, editor?.canvas);
      });
    });
  };

  useEffect(() => {
    editor?.canvas.getActiveObjects().forEach((object) => {
      if (!object.isType('i-text')) return;
      object.set({ strokeWidth: padding });

      editor?.canvas.renderAll();
    });
  }, [padding]);

  useEffect(() => {
    editor?.canvas.getActiveObjects().forEach((object) => {
      if (!object.isType('i-text')) return;
      object.set({ fill: color });

      editor?.canvas.renderAll();
    });
  }, [color]);

  return (
    <div className="editor">
      <div id="toolBar">
        <p className="description"> Add objects </p>
        <div className="section">
          <button className="toolButton" onClick={addText}>
            <Icons.TextFieldsRounded />
            Text
          </button>
          <button className="toolButton" onClick={addCircle}>
            <Icons.CircleOutlined />
            Circle
          </button>
          <button className="toolButton" onClick={addRect}>
            <Icons.SquareOutlined />
            Square
          </button>
        </div>

        <p className="description"> Layers </p>
        <div className="section">
          <button className="toolButton" onClick={moveForward}>
            <Icons.FlipToFrontRounded />
            Forward
          </button>
          <button className="toolButton" onClick={moveBackward}>
            <Icons.FlipToBackRounded />
            Backward
          </button>
        </div>

        <p className="description"> Modify Active Objects </p>
        <div className="section">
          <button className="toolButton" onClick={deleteObject}>
            <Icons.DeleteForeverRounded />
            Delete
          </button>
          <button className="toolButton" onClick={duplicateObject}>
            <Icons.ContentCopyRounded />
            Duplicate
          </button>
        </div>

        <p className="description"> Style </p>
        <div className="section">
          <label className="slider">
            <Icons.BorderColorRounded htmlColor="white" />
            <input
              type="range"
              name="padding"
              min={0}
              max={100}
              onChange={(e) => setPadding(parseFloat(e.target.value))}
            />
          </label>
          <label className="slider">
            <Icons.FormatColorFillRounded htmlColor="white" />
            <input type="color" name="padding" onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>

        <p className="description"> Font </p>
        <div className="section">
          {fonts.map((font) => {
            return (
              <button
                className="toolButton"
                style={{ fontFamily: font }}
                onClick={() => setFont(font)}
              >
                {font}
              </button>
            );
          })}
        </div>

        <p className="description"> Wood </p>
        <div className="section">
          {woods.map((wood) => {
            return (
              <button
                className="toolButton"
                style={{ background: `url(${wood})` }}
                onClick={() => changeWood(wood)}
              ></button>
            );
          })}
        </div>
        <p className="description"> Export features </p>
        <div className="section">
          <button className="toolButton" id="rasterrize" onClick={rasterize}>
            Get Tool Path
          </button>
        </div>
      </div>

      <FabricJSCanvas className="canvas" onReady={onReady} />
    </div>
  );
};

export default Canvas;
