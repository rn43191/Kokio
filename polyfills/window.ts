import Document from "./DOM/Document";

import HTMLImageElement from "./DOM/HTMLImageElement";
import HTMLCanvasElement from "./DOM/HTMLCanvasElement";
import HTMLVideoElement from "./DOM/HTMLVideoElement";

global.document = global.document || Document;

global.HTMLImageElement = global.HTMLImageElement || HTMLImageElement;
global.Image = global.Image || HTMLImageElement;
global.ImageBitmap = global.ImageBitmap || HTMLImageElement;
global.HTMLVideoElement = global.HTMLVideoElement || HTMLVideoElement;
global.HTMLCanvasElement = global.HTMLCanvasElement || HTMLCanvasElement;