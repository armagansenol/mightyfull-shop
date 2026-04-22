export default {
  name: 'store',
  title: 'Store',
  type: 'document',
  fields: [
    {name: 'title', title: 'Store Name', type: 'string'},
    {name: 'address', title: 'Address', type: 'string'},
    {name: 'city', title: 'City', type: 'string'},
    {name: 'country', title: 'Country', type: 'string'},
    {
      name: 'location',
      title: 'Location',
      type: 'geopoint',
    },
  ],
}
