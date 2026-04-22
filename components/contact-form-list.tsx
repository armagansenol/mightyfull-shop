import {Box, Button, Card, Checkbox, Stack, Text, Inline, Label, Flex} from '@sanity/ui'
import React, {useState, useEffect} from 'react'
import {useClient} from 'sanity'

export type Budget = '<100000' | '100000-200000' | '>200000'

export interface ContactFormDocument {
  _type: 'contactForm'
  _id: string
  _createdAt: string
  name: string
  email: string
  phone: string
  budget: Budget
  projectDetails: string
}

const ITEMS_PER_PAGE = 10

// Modified to work with Sanity's structure builder
export function ContactFormList(props: any) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [submissions, setSubmissions] = useState<ContactFormDocument[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const client = useClient({apiVersion: '2021-06-07'})

  useEffect(() => {
    // Fetch total count
    client.fetch('count(*[_type == "contactForm"])').then((count) => setTotalItems(count))

    // Fetch paginated data
    client
      .fetch(
        `*[_type == "contactForm"] | order(_createdAt desc) [$start...$end] {
          _id,
          name,
          email,
          phone,
          budget,
          projectDetails,
          _createdAt
        }`,
        {
          start: currentPage * ITEMS_PER_PAGE,
          end: (currentPage + 1) * ITEMS_PER_PAGE,
        },
      )
      .then((data) => setSubmissions(data))
  }, [currentPage, client])

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Handle checkbox selection
  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === submissions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(submissions.map((item) => item._id))
    }
  }

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete selected items?')) return

    try {
      // Delete all selected documents
      await Promise.all(
        selectedItems.map((id) =>
          client.delete(id).then(() => {
            console.log(`Deleted document: ${id}`)
          }),
        ),
      )

      // Update the UI by removing deleted items
      setSubmissions((prev) => prev.filter((item) => !selectedItems.includes(item._id)))
      setSelectedItems([])
    } catch (error) {
      console.error('Error deleting documents:', error)
    }
  }

  return (
    <Stack space={4} padding={4}>
      <Box>
        <Flex align="center" justify="flex-end" gap={5}>
          <Inline space={2}>
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <Checkbox
                id="selectAll"
                checked={selectedItems.length === submissions.length && submissions.length > 0}
                indeterminate={
                  selectedItems.length > 0 && selectedItems.length < submissions.length
                }
                onChange={handleSelectAll}
              />
              <Label muted htmlFor="selectAll" style={{marginLeft: '0.5em', cursor: 'pointer'}}>
                Select All
              </Label>
            </div>
          </Inline>
          <Button
            tone="critical"
            disabled={selectedItems.length === 0}
            onClick={handleDeleteSelected}
            text="Delete Selected"
          />
        </Flex>
      </Box>
      <Stack space={2}>
        {submissions.length === 0 ? (
          <Flex align="center" justify="center" padding={6}>
            <Text size={2} muted>
              No submissions found
            </Text>
          </Flex>
        ) : (
          submissions.map((submission) => (
            <Card style={{position: 'relative'}} key={submission._id} padding={3} border radius={2}>
              <Stack space={3} padding={2} style={{display: 'flex', flexDirection: 'column'}}>
                <Checkbox
                  style={{marginLeft: 'auto', cursor: 'pointer'}}
                  checked={selectedItems.includes(submission._id)}
                  onChange={() => handleSelect(submission._id)}
                />
                <Stack space={4}>
                  <Stack space={1}>
                    <Inline space={2}>
                      <Text muted>Name:</Text>
                      <Text size={1} weight="bold">
                        {submission.name || 'No name'}
                      </Text>
                    </Inline>
                  </Stack>
                  <Stack space={1}>
                    <Inline space={2}>
                      <Text muted>Email:</Text>
                      <Text>{submission.email || 'No email'}</Text>
                    </Inline>
                  </Stack>
                  <Stack space={1}>
                    <Inline space={2}>
                      <Text muted>Phone:</Text>
                      <Text>{submission.phone || 'No email'}</Text>
                    </Inline>
                  </Stack>

                  <Stack space={1}>
                    <Inline space={2}>
                      <Text muted>Budget:</Text>
                      <Text>{submission.budget || 'No message'}</Text>
                    </Inline>
                  </Stack>
                  <Stack space={1}>
                    <Inline space={2}>
                      <Text muted>Message:</Text>
                      <Text>{submission.projectDetails || 'No message'}</Text>
                    </Inline>
                  </Stack>
                  <Text
                    size={0}
                    muted
                    style={{position: 'absolute', top: 16, left: 16, color: 'orange'}}
                  >
                    {new Date(submission._createdAt).toLocaleDateString()}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
      <Flex align="center" justify="space-between" paddingY={4}>
        <Button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          text="Previous"
        />
        <Text>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <Button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          text="Next"
        />
      </Flex>
    </Stack>
  )
}

// Add a display name for better debugging
ContactFormList.displayName = 'ContactFormList'
