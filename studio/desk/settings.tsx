import {CogIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Settings')
    .id('settings')
    .icon(CogIcon)
    .child(S.document().schemaType('settings').documentId('settings')),
)
