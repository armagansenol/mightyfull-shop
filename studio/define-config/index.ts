import {colorInput} from '@sanity/color-input'
import {visionTool} from '@sanity/vision'
import {AssetSource, defineConfig, type SingleWorkspace} from 'sanity'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {structureTool} from 'sanity/structure'

import Logo from '../components/studio/Logo'
import Navbar from '../components/studio/Navbar'
import {ENVIRONMENT} from '../constants'
import {structure} from '../desk'
import {types} from '../schema'
import resolveProductionUrl from '../utils/resolveProductionUrl'

/**
 * Configuration options that will be passed in
 * from the environment or application
 */
type SanityConfig = Pick<SingleWorkspace, 'projectId' | 'dataset' | 'title' | 'basePath'> & {
  preview: {
    domain?: string
    secret: string
  }
  shopify: {
    storeDomain: string
  }
}

/**
 * Wrap whatever Sanity Studio configuration your project requires.
 *
 * In this example, it's a single workspace but adjust as necessary.
 */
export function defineSanityConfig(config: SanityConfig) {
  /**
   * Prevent a consumer from importing into a worker/server bundle.
   */
  if (typeof document === 'undefined') {
    throw new Error(
      'Sanity Studio can only run in the browser. Please check that this file is not being imported into a worker or server bundle.',
    )
  }

  const {preview, shopify, ...rest} = config

  window[ENVIRONMENT] = {
    preview,
    shopify,
  }

  return defineConfig({
    ...rest,
    plugins: [
      structureTool({
        structure,
      }),
      colorInput(),
      imageHotspotArrayPlugin(),
      media(),
      visionTool(),
    ],
    schema: {
      types,
    },
    document: {
      productionUrl: resolveProductionUrl,
      comments: {
        enabled: true,
      },
    },
    form: {
      file: {
        assetSources: (previousAssetSources: AssetSource[]) => {
          return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
        },
      },
      image: {
        assetSources: (previousAssetSources: AssetSource[]) => {
          return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
        },
      },
    },
    studio: {
      components: {
        navbar: Navbar,
      },
    },
    icon: Logo,
  })
}
