import {ListItemBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) => {
  // Define the single 'Layouts' document
  const layoutDocument = S.document()
    .schemaType('layouts')
    .documentId('layouts') // Ensures it's treated as a singleton
    .title('Edit Layouts')

  // Define the main 'Layouts' list item
  return S.listItem()
    .title('Layouts')
    .id('layouts-main') // Unique ID for this main item
    .child(layoutDocument)
})
