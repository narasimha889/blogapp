import React, { useEffect, useState } from 'react'
import Base from '../Components/Base'
import NewFeed from '../Components/NewFeed'
import { Button, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap'
import CategorySideMenu from '../Components/CategorySideMenu'

function Home() {
  return (
    <Base>
      <div>
        <Container>
          <Row>
            <Col md={{ size: 2 }} className='mt-2'>
              <CategorySideMenu />
            </Col>
            <Col md={{ size: 10 }}>
              <NewFeed />
            </Col>
          </Row>
        </Container>
      </div>
    </Base>
  )
}

export default Home