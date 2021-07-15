import React, { useEffect, useState } from 'react';
import { TCategory } from '../../services/english-for-kids-service';

import './admin-panel-category-card.sass';

interface IProps {
  category: TCategory;
  onNewItemCancel?: (_id: number) => void;
  onSubmitClick: (data: {
    _id: number;
    imgSrc: string;
    title: string;
    img?: File;
  }) => Promise<string>;
  onAddWordsClick: (category: TCategory) => void;
  onDeleteClick: (_id: number) => void;
}

const AdminPanelCategoryCard = ({
  category: { _id, imgSrc, title, cardCount },
  onNewItemCancel,
  onSubmitClick,
  onAddWordsClick,
  onDeleteClick,
}: IProps) => {
  const [isUpdateMode, setUpdateMode] = useState(onNewItemCancel ? true : false);

  const [titleValue, setTitleValue] = useState(title);
  const [imgSource, setImgSource] = useState(imgSrc);
  const [img, setImgFile] = useState('' as unknown);
  const [previousValue, setPreviousValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (titleValue.length === 0) setErrorMessage('Name cannot be empty');
    else setErrorMessage('');
    if (imgSource !== imgSrc) setImgSource(imgSrc);
  }, [titleValue.length, imgSrc, imgSource]);

  const CancelUpdateButtonClick = () => {
    if (isUpdateMode && onNewItemCancel) {
      onNewItemCancel(_id);
      return;
    }
    if (isUpdateMode) setTitleValue(previousValue);
    if (!isUpdateMode) setPreviousValue(title);

    setUpdateMode(!isUpdateMode);
  };

  const SubmitAddWordsClick = async () => {
    if (isUpdateMode) {
      const message = await onSubmitClick({
        _id,
        imgSrc,
        title: titleValue.trim(),
        img: img ? (img as File) : undefined,
      });

      setErrorMessage(message);
      if (!message) setUpdateMode(false);
    }
    if (!isUpdateMode) onAddWordsClick({ _id, cardCount, imgSrc, title: title.trim() });
  };

  return (
    <div className="admin-panel-category-card">
      <div className="category-card__input-wrapper">
        <h4 className="typography-h4">Title</h4>
        <input
          disabled={!isUpdateMode}
          className="admin-panel-category-card__heading"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />
      </div>
      <div className="category-card__input-wrapper">
        <h4 className="typography-h4 admin-panel-category-card__info">Words: {cardCount}</h4>
      </div>
      <div className="category-card__input-wrapper">
        <h4 className="typography-h4 admin-panel-category-card__info">Image</h4>

        {imgSource === '' ? null : (
          <img
            src={imgSource}
            alt="Category title preview"
            className="admin-panel-category-card__image"
          />
        )}
        <input
          disabled={!isUpdateMode}
          type="file"
          accept="image/png, image/jpeg, image/svg"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImgFile(e.target.files[0]);
              // setImgSrc(e.target.files[0].name);
            }
          }}
        />
      </div>
      <span className="admin-panel-category-card__heading-error-message">{errorMessage}</span>

      <div className="admin-panel-category-card__buttons-wrapper">
        <button
          className="admin-panel-category-card__update-button"
          onClick={CancelUpdateButtonClick}
        >
          {isUpdateMode ? 'Cancel' : 'Update'}
        </button>
        <button
          disabled={titleValue.length === 0}
          className="admin-panel-category-card__add-word-button"
          onClick={SubmitAddWordsClick}
        >
          {isUpdateMode ? 'Submit' : 'Add Word'}
        </button>
      </div>
      <button
        className="admin-panel-category-card__delete-button"
        onClick={() => onDeleteClick(_id)}
      ></button>
    </div>
  );
};

export default AdminPanelCategoryCard;
