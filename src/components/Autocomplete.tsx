import React, { useEffect, useState } from 'react';
import cn from 'classNames';
import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filtredPeoples, setFiltredPeoples] = useState(peopleFromServer);

  const filterPeople = (inputFilterValue: string) => {
    setFiltredPeoples(
      peopleFromServer.filter(person => person.name.includes(inputFilterValue)),
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;

    setInputValue(newInputValue);

    onSelected(null);
  };

  const handleBlur = () => {
    window.setTimeout(() => setIsOpen(false), 100);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      filterPeople(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, filtredPeoples]);

  return (
    <div className={cn('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filtredPeoples.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => {
                setInputValue(person.name);
                setIsOpen(false);
                onSelected(person);
              }}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}

          {isOpen && filtredPeoples.length === 0 && inputValue !== '' && (
            <div
              className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start
        "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
