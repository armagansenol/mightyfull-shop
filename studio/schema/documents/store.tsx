import {PinIcon} from '@sanity/icons'

export default {
  name: 'store',
  title: 'Store',
  type: 'document',
  icon: PinIcon,
  fields: [
    {
      name: 'retailer',
      title: 'Retailer',
      type: 'string',
      description: 'e.g. GNC, Whole Foods, Sprouts',
    },
    {
      name: 'title',
      title: 'Store Name',
      type: 'string',
      description: 'Optional override (defaults to the retailer name in lists).',
    },
    {name: 'address', title: 'Address Line 1', type: 'string'},
    {name: 'addressLine2', title: 'Address Line 2', type: 'string'},
    {name: 'city', title: 'City', type: 'string'},
    {name: 'state', title: 'State / Region', type: 'string'},
    {name: 'zip', title: 'Zip / Postal Code', type: 'string'},
    {name: 'country', title: 'Country', type: 'string', initialValue: 'United States'},
    {name: 'phone', title: 'Phone', type: 'string'},
    {name: 'website', title: 'Website', type: 'url'},
    {
      name: 'location',
      title: 'Location (Map Pin)',
      type: 'geopoint',
      description: 'Drop a pin to control where this store appears on the map.',
    },
  ],
  preview: {
    select: {
      retailer: 'retailer',
      title: 'title',
      city: 'city',
      state: 'state',
      address: 'address',
    },
    prepare({
      retailer,
      title,
      city,
      state,
      address,
    }: {
      retailer?: string
      title?: string
      city?: string
      state?: string
      address?: string
    }) {
      const main = retailer || title || 'Store'
      const subtitle = [address, [city, state].filter(Boolean).join(', ')]
        .filter(Boolean)
        .join(' — ')
      return {
        title: main,
        subtitle: subtitle || undefined,
      }
    },
  },
}
