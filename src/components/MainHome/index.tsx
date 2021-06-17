import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'

import { findAllStores, deleteStore } from '../../api'
import { IStore } from '../../models'
import FormStore from '../FormStore'
import InputSearchStore from '../InputSearchStore'
import './styles.scss'

const MainHome: React.FC = () => {
  const [stores, setStores] = useState<IStore[] | undefined>()

  const handleSearchAndRender = () => {
    alert('procurou e atualizou a table')
  }
  const handleDelete = async (id: string) => {
    await deleteStore(id)
    loadStoresFromApi()
  }
  const loadStoresFromApi = async () => {
    try {
      const allStores = await findAllStores()
      setStores(allStores)
    } catch (error) {
      console.error('Error when try to get the Stores', error)
    }
  }

  useEffect(() => {
    // Atualiza o titulo do documento usando a API do browser
    loadStoresFromApi()
  }, [])

  /// modal create
  const [showModalNewStore, setShowModalNewStore] = useState(false)
  const handleCloseModalNewStore = () => setShowModalNewStore(false)
  const handleShowModalNewStore = () => setShowModalNewStore(true)

  /// modal edit
  const [showModalEditStore, setShowModalEditStore] = useState(false)
  const [idStoreToEdit, setIdStoreToEdit] = useState<undefined | string>(
    undefined
  )
  const handleCloseModalEditStore = () => setShowModalEditStore(false)
  const handleShowModalEditStore = (id: string) => {
    // vai carregar o form com o id
    setIdStoreToEdit(id)
    setShowModalEditStore(true)
  }

  return (
    <>
      <div className='items-input-search col-md-12 '>
        <InputSearchStore
          id='input-search'
          name='input-search'
          type='text'
          placeholder='Type to search a store ..'
        />
        <Button className='btn btn-dark' onClick={handleSearchAndRender}>
          Search
        </Button>
      </div>
      {stores ? (
        <Table
          bordered
          hover
          className='table-list-stores col-md-12 text-center'
        >
          <thead>
            <tr>
              <th>Key</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.key}>
                <td>{store.key}</td>
                <td>{store.address.country}</td>
                <td>{store.address.state}</td>
                <td>{store.address.city}</td>
                <td>{store.address.district}</td>
                <td className='action-icons'>
                  <AiFillEdit
                    className='icon-edit'
                    onClick={() => handleShowModalEditStore(store.key)}
                    size={'20px'}
                    title={`Click to remove the store ${store.key}`}
                  />

                  <AiFillDelete
                    onClick={() => handleDelete(store.key)}
                    size={'20px'}
                    title={`Click to edit the store ${store.key}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className='msg-error-not-found-stores'>
          Sorry, no records match your search
        </p>
      )}
      <Button
        className='btn-dark  btn-new-store col-md-12'
        onClick={handleShowModalNewStore}
      >
        Click to create a new store
      </Button>
      {/* new modal */}
      <Modal
        name='new-store'
        show={showModalNewStore}
        onHide={handleCloseModalNewStore}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormStore
            type='new'
            id={idStoreToEdit}
            handleCloseModalNewStore={handleCloseModalNewStore}
          />
        </Modal.Body>
      </Modal>

      {/* edit modal */}
      <Modal
        name='edit-store'
        show={showModalEditStore}
        onHide={handleCloseModalEditStore}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit a Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormStore
            type='edit'
            id={idStoreToEdit}
            handleCloseModalEditStore={handleCloseModalEditStore}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default MainHome
