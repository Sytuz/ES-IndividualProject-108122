const Toasts = ({ toasts, setToasts }) => {
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };
    return (
        <div className="position-fixed top-0 start-50 translate-middle-x p-2" style={{ zIndex: 1100 }}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast align-items-center text-bg-${toast.type} border-0 show mb-2`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body">{toast.message}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            aria-label="Close"
                            onClick={() => removeToast(toast.id)}
                        ></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toasts;
