import { device } from "../settings";

export class Material {

    texture: GPUTexture | null = null;
    view: GPUTextureView
    sampler: GPUSampler

    async initialize(url: string) {

        const response = await fetch(url);
        const blob = await response.blob();
        const imageData = await createImageBitmap(blob);

        await this._load(imageData);

        this.view = this.texture.createView({
            format: "rgba8unorm",
            dimension: "2d",
            aspect: "all",
            baseMipLevel: 0,
            mipLevelCount: 1,
            baseArrayLayer: 0,
            arrayLayerCount: 1,
        });

        this.sampler = device.createSampler({
            addressModeU: "repeat",
            addressModeV: "repeat",
            magFilter: "linear",
            minFilter: "nearest",
            mipmapFilter: "nearest",
            maxAnisotropy: 1
        });
    }

    destroy() {
        this.texture.destroy();
    }

    async _load(imageData: ImageBitmap) {
        this.texture = device.createTexture({
            size: {
                width: imageData.width,
                height: imageData.height
            },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT

        })

        device.queue.copyExternalImageToTexture(
            { source: imageData },
            { texture: this.texture },
            { width: imageData.width, height: imageData.height }
        )
    }

    
}