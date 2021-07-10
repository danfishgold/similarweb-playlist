import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { buildSong, renderWithFakePlaylistProvider } from '../../test/testUtils'
import * as youtube from '../../youtube'
import SongInput from '../SongInput'

test('the input is disabled during submission', async () => {
  renderWithFakePlaylistProvider(<SongInput />, [])
  const button = screen.getByRole('button', { name: /add song/i })
  const input = screen.getByRole('textbox', { name: /search/i })
  const query = 'wandaland'

  const mock = jest
    .spyOn(youtube, 'fetchSongForVideoIdOrSearchQuery')
    .mockResolvedValue(buildSong())

  expect(input).not.toBeDisabled()
  userEvent.type(input, query)
  userEvent.click(button)
  expect(input).toBeDisabled()
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith(query)
  await waitFor(() => expect(input).not.toBeDisabled())
})

test('the input is emptied after success', async () => {
  renderWithFakePlaylistProvider(<SongInput />, [])
  const button = screen.getByRole('button', { name: /add song/i })
  const input = screen.getByRole('textbox', { name: /search/i })
  const query = 'wandaland'

  const mock = jest
    .spyOn(youtube, 'fetchSongForVideoIdOrSearchQuery')
    .mockResolvedValue(buildSong())

  userEvent.type(input, query)
  userEvent.click(button)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith(query)
  await waitFor(() => expect(input).toHaveValue(''))
})

test('the input is not emptied after a failure', async () => {
  renderWithFakePlaylistProvider(<SongInput />, [])
  const button = screen.getByRole('button', { name: /add song/i })
  const input = screen.getByRole('textbox', { name: /search/i })
  const query = 'wandaland'

  const mock = jest
    .spyOn(youtube, 'fetchSongForVideoIdOrSearchQuery')
    .mockRejectedValue(new Error('some error'))

  const consoleErrorMock = jest
    .spyOn(console, 'error')
    .mockImplementationOnce(() => {})

  userEvent.type(input, query)
  userEvent.click(button)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith(query)
  await waitFor(() => expect(button).toHaveTextContent('Add song'))
  expect(input).toHaveValue(query)
  expect(consoleErrorMock).toHaveBeenCalledTimes(1)
})

test('the button title and clickability update correctly throughout submission', async () => {
  renderWithFakePlaylistProvider(<SongInput />, [])
  const button = screen.getByRole('button', { name: /add song/i })
  const input = screen.getByRole('textbox', { name: /search/i })
  const query = 'wandaland'

  const mock = jest
    .spyOn(youtube, 'fetchSongForVideoIdOrSearchQuery')
    .mockResolvedValue(buildSong())

  expect(button.textContent).toMatch('Add song')
  userEvent.type(input, query)
  userEvent.click(button)
  expect(button.textContent).toMatch('Searching')
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith(query)
  await waitFor(() => expect(button.textContent).toMatch('Add song'))
})
