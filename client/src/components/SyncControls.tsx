import React, { PropsWithChildren } from 'react'
import { ServerSyncType, setServerSyncInControls } from '../reducer'
import { usePlaylist } from '../usePlaylist'

export default function SyncControls() {
  const [{ serverSync }, dispatch] = usePlaylist()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setServerSyncInControls(e.target.value as ServerSyncType))
  }

  return (
    <div className='sync-controls'>
      <h2>Sync Status (not fully tested)</h2>
      {serverSync.type === 'none' && serverSync.becauseDisconnected && (
        <p className='sync-controls__disconnection-warning'>
          Oh no! You've lost connection to the server so you're not getting or
          sending updates. Pick one of the options below to reconnect.
        </p>
      )}
      <Radio
        groupName='serverSync'
        value='full'
        id='server-sync--full'
        checked={serverSync.type === 'full'}
        onChange={onChange}
      >
        <p>
          <strong>Synced</strong>: Adding, moving, removing, and playing songs
          is all synced with other users.
        </p>
      </Radio>
      <Radio
        groupName='serverSync'
        value='partial'
        id='server-sync--partial'
        checked={serverSync.type === 'partial'}
        onChange={onChange}
      >
        <p>
          <strong>Addition only</strong>: Songs that you add are added for other
          users, and songs other people add will appear in your playlist, but
          you control the order and the currently playing song.
        </p>
      </Radio>
      <Radio
        groupName='serverSync'
        value='none'
        id='server-sync--none'
        checked={serverSync.type === 'none'}
        onChange={onChange}
      >
        <p>
          <strong>Disconnected</strong>: Nothing goes in, nothing goes out.
        </p>
      </Radio>
    </div>
  )
}

type RadioProps = PropsWithChildren<{
  groupName: string
  value: ServerSyncType
  id: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}>

function Radio({
  groupName,
  value,
  id,
  checked,
  children,
  onChange,
}: RadioProps) {
  return (
    <div className='radio-item'>
      <input
        type='radio'
        id={id}
        name={groupName}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  )
}
