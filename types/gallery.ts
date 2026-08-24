export type GalleryItem = {
  src: string;
  /**
   * Present when this slide is a looping clip rather than a still. The two
   * clips were 51.2 MB and 21.7 MB animated GIFs, which next/image passes
   * through unoptimised; as h264 they are 0.82 MB and 0.40 MB.
   */
  video?: {
    poster: string;
    width: number;
    height: number;
  };
};
