import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, text, boolean, number, object } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router-dom';
import IdentityAvatar, { AvatarPlaceholder } from '../Avatar';
import { TextAreaForm, ReplyForm, CommentForm } from '../CommentForm';
import Header from '../Header';
import TranslationsContext from '../Translations';
import EntityExample from '../img/entityExample.svg';
import Context from '../Context';
import { SocialBadges } from '../ShowPage';
import styled from 'styled-components';
import { LinkedEntityAvatar, EntityName, Entities, EntityAvatar } from '../Entity';
import Link, { A } from '../Link';

const StyledInput = styled.div.attrs({
  children: props => (
    <input
      style={{
        fontSize: '18px',
        fontWeight: 500,
        color: '#623cea',
        width: 'calc(100% - 30px)',
        padding: '15px',
        height: '57px',
        background: 'none',
        outline: 'none',
        border: 'none'
      }}
      {...props}
    />
  )
})`
  width: 100%;
  border-radius: 8px;
  background: #f3f0ff;
  box-shadow: inset 0 1px 3px 0 #d8d4e7;
  font-size: 18px;
  font-weight: 500;
  color: #623cea;
  outline: none;
  border: none;
  position: relative;
  margin-top: 10px;

  &:before {
    content: 'ETH';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    font-weight: 500;
    font-size: 14px;
  }
`;

const Position = styled.div`
  font-size: 14px;
  color: #928f9b;
  margin-top: 6px;
`;

const StyledButton = styled.button`
  height: 60px;
  width: calc(100% + 40px);
  background: linear-gradient(180deg, #9b6ff6 0%, #623cea 100%);
  margin: 18px -20px -20px;
  color: white;
  font-size: 18px;
  font-weight: 500;
  outline: none;
  border: none;
  border-radius: 0 0 12px 12px;
`;

const CustomCatForm = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const CustomCatFormButton = styled.button`
  outline: none;
  margin: 0 5px 0 0;
  padding: 0;
  background: linear-gradient(180deg, #9b6ff6 0%, #623cea 100%);
  box-shadow: 0 2px 10px 0 rgba(99, 61, 234, 0.3);
  border: none;
  color: white;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;

  &:disabled {
    background: #f3f0ff;
    opacity: 0.7;
    color: #9b6ff6;
    box-shadow: none;
  }
`;

const CustomCatFormInput = styled.div`
  width: 100%;
  border-radius: 8px;
  background: #f3f0ff;
  box-shadow: inset 0 1px 3px 0 #d8d4e7;
  font-size: 18px;
  font-weight: 500;
  color: #623cea;
  outline: none;
  border: none;
  position: relative;
  margin-left: 10px;
  display: flex;
  align-items: center;
`;

const formatCurrency = value => {
  return (value * 10 ** -18).toFixed(3);
};

class Catvertised extends React.Component {
  state = {
    step: 'catvertised',
    value: 0,
    customCatId: undefined
  };

  static Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    box-shadow: 0 4px 10px 0 rgba(98, 60, 234, 0.07);
    border-radius: 12px;
    ${({ showBorder }) => (showBorder ? 'border: 2px solid #cdf5d4;' : '')};
  `;

  calculatePosition = boosts => {
    const scores = Object.entries(boosts)
      .sort(([, { score: a }], [, { score: b }]) => b - a)
      .map(([, { score }]) => score);
    let position = 0;
    while (position < scores.length) {
      if (scores[position] > this.state.value * 10 ** 18) {
        position += 1;
      } else {
        break;
      }
    }
    return position + 1;
  };

  boost = async () => {
    this.setState({ step: 'submitted' });
  };

  render() {
    return (
      <Context.Consumer>
        {({ boostStore: { boosts, boost } }) => (
          <Catvertised.Container showBorder={this.state.step === 'catvertised'}>
            <CatvertisedBody>
              {this.state.step === 'catvertised' && (
                <React.Fragment>
                  <CatvertisedTitle>Catvertised</CatvertisedTitle>
                  <AddAKitty onClick={() => this.setState({ step: 'pickCat' })}>Add a kittie</AddAKitty>
                  <CatvertisedList>
                    {Object.entries(boosts)
                      .sort(([, { score: a }], [, { score: b }]) => b - a)
                      .slice(0, 3)
                      .map(([id, { score }]) => (
                        <CatvertisedItem>
                          <CatvertisedItemLink to={`/${id}`}>
                            <EntityAvatar size="medium" id={id} />
                            <div>
                              <CatvertisedName>
                                <b>
                                  <EntityName id={id} />
                                </b>
                              </CatvertisedName>
                              <CatvertisedScore>{formatCurrency(score)} ETH</CatvertisedScore>
                            </div>
                          </CatvertisedItemLink>
                        </CatvertisedItem>
                      ))}
                  </CatvertisedList>
                </React.Fragment>
              )}
              {this.state.step === 'pickCat' && (
                <React.Fragment>
                  <CatvertisedTitle>Catvertise a kittie</CatvertisedTitle>
                  <CustomCatForm>
                    <EntityAvatar size="medium" id={this.state.customCatId} />
                    <CustomCatFormInput>
                      <input
                        style={{
                          fontSize: '18px',
                          fontWeight: 500,
                          color: '#623cea',
                          width: 'calc(100% - 40px)',
                          padding: '15px',
                          height: '57px',
                          background: 'none',
                          outline: 'none',
                          border: 'none'
                        }}
                        type="text"
                        value={this.state.customCatId}
                        onChange={e => {
                          this.setState({ customCatId: e.target.value });
                        }}
                        placeholder="Other cat id"
                      />
                      <CustomCatFormButton
                        disabled={!this.state.customCatId}
                        onClick={() => this.setState({ step: 'form', entityId: this.state.customCatId })}
                      >
                        ✔
                      </CustomCatFormButton>
                    </CustomCatFormInput>
                  </CustomCatForm>
                  <CatvertisedList>
                    <Entities>
                      {({ entities }) =>
                        entities.map(entity => (
                          <CatvertisedItem>
                            <CatvertisedItemButton onClick={() => this.setState({ step: 'form', entityId: entity.id })}>
                              <EntityAvatar size="medium" id={entity.id} />
                              <CatvertisedName>
                                <b>
                                  <EntityName id={entity.id} />
                                </b>
                              </CatvertisedName>
                            </CatvertisedItemButton>
                          </CatvertisedItem>
                        ))
                      }
                    </Entities>
                  </CatvertisedList>
                </React.Fragment>
              )}
              {this.state.step === 'form' && (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LinkedEntityAvatar size="medium" id={this.state.entityId} />
                    <CatvertisedName>
                      <b>
                        <EntityName id={this.state.entityId} />
                      </b>
                    </CatvertisedName>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '20px' }}>Catvertise with</div>
                  <StyledInput
                    type="text"
                    value={this.state.value}
                    onChange={e => {
                      this.setState({ value: e.target.value });
                    }}
                  />
                  <Position>Position: #{this.calculatePosition(boosts)}</Position>
                  <StyledButton
                    onClick={() => {
                      boost(this.state.entityId, this.state.value * 10 ** 18);
                    }}
                  >
                    Catvertise!
                  </StyledButton>
                </React.Fragment>
              )}
              {this.state.step === 'submitted' && (
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ color: 'green', fontSize: '24px' }}>✔</div>
                  <div style={{ fontWeight: 500, fontSize: '32px', color: '#060310' }}>Success!</div>
                  <div style={{ fontSize: '18px' }}>
                    You've catvertised <EntityName id={this.state.entityId} />
                  </div>
                  <A>See it on Etherscan</A>
                </div>
              )}
            </CatvertisedBody>
          </Catvertised.Container>
        )}
      </Context.Consumer>
    );
  }
}

const PickEntity = styled.button`
  border: none;
  background: none;
  outline: none;
  margin: -0.375rem;
  padding: 0.375rem 1rem;
  width: 100%;
  border-radius: 33px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f4f1ff;
    color: #623cea;
  }
`;

const CatvertisedBody = styled.div`
  padding: 20px;
`;

const CatvertisedTitle = styled.div`
  font-family: Rubik;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 500;
`;

const AddAKitty = styled.button`
  border: none;
  outline: none;
  background: none;
  color: #623cea;
  font-weight: 500;
  font-size: 0.8rem;
  padding: 0;
  cursor: pointer;
`;

const CatvertisedList = styled.ul`
  margin-top: 20px;
`;

const CatvertisedItem = styled.li`
  height: 54px;
  display: flex;
  align-items: center;
  & + & {
    margin-top: 20px;
  }
`;

const CatvertisedItemLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const CatvertisedItemButton = styled.button`
  border: none;
  outline: none;
  background: none;
  display: flex;
  align-items: center;
  padding: 0.375rem;
  margin: -0.375rem;
  font-size: 1rem;
  width: 100%;
  border-radius: 33px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f4f1ff;
    color: #623cea;

    &:before {
      display: block;
      position: absolute;
      top: 50%;
      right: 2rem;
      font-size: 0.8rem;
      font-weight: 500;
      content: 'Add';
      transform: translateY(-50%);
    }
  }
`;

const CatvertisedName = styled.span`
  margin-left: 10px;
`;

const CatvertisedScore = styled.div`
  margin-left: 10px;
  font-size: 14px;
  color: #928f9b;
  font-weight: 500;
`;

storiesOf('Components', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '600px',
        height: '100vh',
        margin: '0 auto'
      }}
    >
      {story()}
    </div>
  ))
  .add('Avatar', () => {
    const size = select(
      'Size',
      {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      },
      'small'
    );

    return <IdentityAvatar size={size} src={EntityExample} backgroundColor={text('Background color')} />;
  })
  .add('Comment Form', () => <TextAreaForm Form={CommentForm} placeholder={text('Placeholder', 'Placeholder')} />)
  .add('Reply Form', () => <TextAreaForm Form={ReplyForm} placeholder={text('Placeholder', 'Placeholder')} />)
  .add('Header', () => {
    const translations = {
      entityName: text('Entity Name', 'Kitty'),
      noEntitiesError: text('No Entities Error', 'No cats found')
    };
    const activeEntity = object('Active cat', {
      image_url: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/663451.svg',
      name: null,
      id: '123'
    });
    const entityStore = {
      activeEntity,
      myEntities: [activeEntity],
      getEntity() {
        return activeEntity;
      },
      changeActiveEntityTo: action('Change active entity to')
    };
    const web3Store = {
      provider: boolean('Metamask enabled', false),
      from: boolean('Metamask unlocked', false)
    };
    return (
      <MemoryRouter>
        <Context.Provider value={{ entityStore, web3Store }}>
          <TranslationsContext.Provider value={translations}>
            <Header />
          </TranslationsContext.Provider>
        </Context.Provider>
      </MemoryRouter>
    );
  })
  .add('SocialBadges', () => {
    const feedStore = { label: action('Label') };
    const entity = object('Entity', {
      image_url: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/663451.svg',
      url: 'https://www.cryptokitties.co/kitty/663451',
      name: null,
      color: 'pink',
      id: '123'
    });
    const entityStore = {
      getEntity(id) {
        return entity;
      }
    };
    return (
      <Context.Provider value={{ feedStore, entityStore }}>
        <SocialBadges
          id={entity.id}
          editable={boolean('editable')}
          facebook={text('facebook')}
          twitter={text('twitter')}
          instagram={text('instagram')}
          github={text('github')}
        />
      </Context.Provider>
    );
  })
  .add('Catvertised', () => {
    const entities = object('Entities', {
      1: {
        image_url: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/1.svg',
        url: 'https://www.cryptokitties.co/kitty/1',
        name: null,
        color: 'red',
        id: 1
      },
      123: {
        image_url: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/123.svg',
        url: 'https://www.cryptokitties.co/kitty/123',
        name: null,
        color: 'pink',
        id: 123
      },
      1234: {
        image_url: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/1234.svg',
        url: 'https://www.cryptokitties.co/kitty/1234',
        name: null,
        color: 'pink',
        id: 1234
      }
    });
    const boostStore = {
      boosts: {
        123: { score: 98765432187654315 },
        1234: { score: 12345678901234567890 }
      },
      boost: action('Boosted kitty')
    };
    const entityStore = {
      myEntities: [
        {
          asset: 'ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d',
          sequence: 5301937,
          token: '123'
        },
        {
          asset: 'ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d',
          sequence: 5462630,
          token: '1234'
        }
      ],
      getEntity(id) {
        return entities[id];
      }
    };

    return (
      <div style={{ width: '300px' }}>
        <MemoryRouter>
          <Context.Provider value={{ boostStore, entityStore }}>
            <Catvertised />
          </Context.Provider>
        </MemoryRouter>
      </div>
    );
  });
