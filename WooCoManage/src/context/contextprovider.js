import { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
	const [image, setImage] = useState();
	const [selectedImages, setSelectedImages] = useState([]);
	const [uploadImages, setUploadImages] = useState([]);
	const [editGalleryContext, setEditGalleryContext] = useState([]);
	const [messageForAlert, setMessageForAlert] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
		color: 'error',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const [itemsCategories, setItemsCategories] = useState([]);
	const [itemsTags, setItemsTags] = useState([]);
	const [currentPage, setCurrentPage] = useState('Products');
	return (
		<StateContext.Provider
			value={{
				image,
				setImage,
				selectedImages,
				setSelectedImages,
				uploadImages,
				setUploadImages,
				editGalleryContext,
				setEditGalleryContext,
				messageForAlert,
				setMessageForAlert,
				loading,
				setLoading,
				itemsCategories,
				setItemsCategories,
				itemsTags,
				setItemsTags,
				currentPage,
				setCurrentPage,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
