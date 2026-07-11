import { create } from 'zustand';

const useModalStore = create((set) => ({
    activeModal: null, // cart || navigation bar || search bar
    openModal: (modalName) => {
        document.body.style.overflow = "hidden"
        set({activeModal: modalName})
    },
    closeModal: () => {
        document.body.style.overflow = "unset"
        set({activeModal: null})
    }
}))

export default useModalStore;