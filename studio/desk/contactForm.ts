import {EnvelopeIcon} from '@sanity/icons'
import {ContactFormList} from '../components/contact-form-list'
import defineStructure from '../utils/defineStructure'

export default defineStructure((S, context) => {
  return S.listItem()
    .title('Contact Form Submissions')
    .icon(EnvelopeIcon)
    .child(
      S.list()
        .title('Contact Form Submissions')
        .items([
          S.listItem()
            .title('All Submissions')
            .icon(EnvelopeIcon)
            .child(
              S.documentTypeList('contactForm')
                .title('Contact Form Submissions')
                .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
            ),
          S.listItem()
            .title('Submission Manager')
            .icon(EnvelopeIcon)
            .child(
              S.component(ContactFormList).title('Submission Manager').id('contact-form-manager'),
            ),
        ]),
    )
})
