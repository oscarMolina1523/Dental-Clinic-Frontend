import React, { useState } from "react";
import Toast from "../../shared/Toast";
import { useUpdateUser } from "../../hooks/useUsers";
import GenericDrawer from "../../shared/drawer/GenericDrawer";
import User from "../../models/UserModel";
import useImageUpload from "../../hooks/useImageUpload";
import { SPECIALTIES, type Specialty } from "../../utils/specialtiesData.enum";
import SearchableSelect from "../../shared/searchableSelect/SearchableSelect";

interface EditUserDrawerProps {
    isOpen: boolean;
    onHide: () => void;
    user: User | null;
}

const EditUserDrawer: React.FC<EditUserDrawerProps> = ({
    isOpen,
    onHide,
    user,
}) => {
    const { uploadImage } = useImageUpload();
    const {
        mutate: updateUser,
        isPending,
    } = useUpdateUser();

    const [prevUser, setPrevUser] = useState<User | null>(user);
    const [form, setForm] = useState<User | null>(user);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSpecialist, setIsSpecialist] = useState(
        !!user?.specialties?.trim()
    );

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    if (user !== prevUser) {
        setPrevUser(user);
        setForm(user);
        setIsSpecialist(!!user?.specialties?.trim());
    }

    const showToast = (
        type: "success" | "error",
        message: string
    ) => {
        setToast({
            type,
            message,
        });
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;

        setImageFile(file);
    };

    const handleSpecialistChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setIsSpecialist(checked);

        if (!checked) {
            setForm((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    specialties: "",
                    membershipNumber: "",
                };
            });
        }
    };

    const handleSpecialtyChange = (specialty: Specialty) => {
        setForm((prev) => {
            if (!prev) return prev;

            const currentSpecialties = prev.specialties
                ? prev.specialties
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : [];

            if (currentSpecialties.includes(specialty.id)) {
                return prev;
            }

            return {
                ...prev,
                specialties: [...currentSpecialties, specialty.id].join(","),
            };
        });
    };

    const handleRemoveSpecialty = (specialtyId: string) => {
        setForm((prev) => {
            if (!prev) return prev;

            const specialties = prev.specialties
                .split(",")
                .map((item) => item.trim())
                .filter(
                    (item) => item && item !== specialtyId
                );

            return {
                ...prev,
                specialties: specialties.join(","),
            };
        });
    };

    const handleSubmit = async () => {
        if (!user || !form) {
            return;
        }

        if (!form.fullName.trim()) {
            showToast(
                "error",
                "El nombre completo es obligatorio."
            );
            return;
        }

        if (!form.email.trim()) {
            showToast(
                "error",
                "El email es obligatorio."
            );
            return;
        }

        try {

            let imageUrl = form.image;

            /*
             * Si el usuario seleccionó una nueva imagen,
             * primero la subimos y obtenemos la URL pública.
             */
            if (imageFile) {
                const uploadedImageUrl = await uploadImage(imageFile);

                if (!uploadedImageUrl) {
                    showToast(
                        "error",
                        "No se pudo subir la imagen."
                    );
                    return;
                }

                imageUrl = uploadedImageUrl;
            }

            console.log("image Url", imageUrl);


            updateUser(
                {
                    id: user.id,
                    user: {
                        fullName: form.fullName.trim(),
                        phoneNumber: form.phoneNumber.trim(),
                        image: imageUrl,
                        membershipNumber: form.membershipNumber,
                        specialties: form.specialties
                    }
                },
                {
                    onSuccess: () => {
                        showToast(
                            "success",
                            "El usuario se actualizó correctamente."
                        );

                        onHide();
                    },

                    onError: (error) => {
                        showToast(
                            "error",
                            error.message ||
                            "No se pudo actualizar el usuario."
                        );
                    },
                }
            );
        } catch {
            showToast(
                "error",
                "No se pudo subir la imagen."
            );
        }
    };

    const selectedSpecialties = form?.specialties
        ? form.specialties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    const availableSpecialties = SPECIALTIES.filter(
        (specialty) => !selectedSpecialties.includes(specialty.id)
    );

    return (
        <>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Overlay */}
            <div
                onClick={onHide}
                className={`
                    fixed inset-0 z-40
                    bg-black/30
                    transition-opacity duration-300
                    ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                    `}
            />

            <GenericDrawer
                isOpen={isOpen}
                onHide={onHide}
                title="Editar Usuario"
                description="Modifica la información del usuario"
                width="w-112.5"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-slate-600
                                hover:bg-slate-100
                                rounded-lg
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                                bg-[#001D4A]
                                rounded-lg
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            {isPending
                                ? "Guardando..."
                                : "Guardar Cambios"}
                        </button>
                    </>
                }
            >
                {/* TODO EL BODY ES EXCLUSIVO DE EDITAR */}

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form?.fullName || ""}
                            onChange={handleChange}
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Teléfono
                        </label>

                        <input
                            type="text"
                            name="phoneNumber"
                            value={form?.phoneNumber || ""}
                            onChange={handleChange}
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Imagen
                        </label>

                        <input
                            type="file"
                            id="userImage"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="userImage"
                            className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    bg-slate-100
                                    border
                                    border-slate-200
                                    rounded-lg
                                    cursor-pointer
                                    hover:bg-slate-200
                                "
                        >
                            Seleccionar imagen
                        </label>

                        <span className=" ml-1 text-sm text-slate-500 truncate">
                            {imageFile
                                ? imageFile.name
                                : "No se ha seleccionado una imagen"}
                        </span>
                        {/* Imagen actual */}
                        {form?.image && !imageFile && (
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 mb-2">
                                    Imagen actual
                                </p>

                                <img
                                    src={form.image}
                                    alt="Imagen actual"
                                    className="
                                        w-20
                                        h-20
                                        rounded-lg
                                        object-cover
                                        border
                                        border-slate-200
                                    "
                                />
                            </div>
                        )}

                        {/* Preview de nueva imagen */}
                        {imageFile && (
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 mb-2">
                                    Nueva imagen
                                </p>

                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Nueva imagen"
                                    className="
                                        w-20
                                        h-20
                                        rounded-lg
                                        object-cover
                                        border
                                        border-slate-200
                                    "
                                />
                            </div>
                        )}

                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Codigo de Profesional
                        </label>

                        <input
                            type="text"
                            name="membershipNumber"
                            value={form?.membershipNumber || ""}
                            onChange={handleChange}
                            className="
                                w-full
                                px-3 py-2.5
                                border border-slate-200
                                rounded-lg
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div> */}

                    {/* Especialista */}
                    <div className="border-t border-slate-100 pt-5">

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSpecialist}
                                onChange={handleSpecialistChange}
                                className="
                h-4
                w-4
                rounded
                border-slate-300
                text-blue-600
                focus:ring-blue-500
                cursor-pointer
            "
                            />

                            <span className="text-sm font-medium text-slate-700">
                                ¿Es especialista?
                            </span>
                        </label>

                        {isSpecialist && (
                            <div className="mt-4 space-y-5">

                                {/* Especialidades */}
                                <div>
                                    <SearchableSelect<Specialty>
                                        label="Especialidades"
                                        value=""
                                        items={availableSpecialties}
                                        getOptionValue={(specialty) => specialty.id}
                                        getOptionLabel={(specialty) => specialty.name}
                                        placeholder="Seleccione una especialidad"
                                        searchPlaceholder="Buscar especialidad..."
                                        noResultsMessage="No se encontraron especialidades."
                                        onChange={handleSpecialtyChange}
                                    />

                                    {/* Especialidades seleccionadas */}
                                    {selectedSpecialties.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedSpecialties.map((specialtyId) => {
                                                const specialty = SPECIALTIES.find(
                                                    (item) => item.id === specialtyId
                                                );

                                                if (!specialty) return null;

                                                return (
                                                    <div
                                                        key={specialty.id}
                                                        className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        bg-blue-50
                                        border
                                        border-blue-100
                                        rounded-lg
                                        text-sm
                                        text-blue-700
                                    "
                                                    >
                                                        <span>
                                                            {specialty.name}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveSpecialty(
                                                                    specialty.id
                                                                )
                                                            }
                                                            className="
                                            text-blue-500
                                            hover:text-red-500
                                            cursor-pointer
                                            font-medium
                                        "
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {selectedSpecialties.length === 0 && (
                                        <p className="mt-2 text-xs text-slate-400">
                                            Seleccione una o más especialidades.
                                        </p>
                                    )}
                                </div>

                                {/* Código profesional */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Código de Profesional
                                    </label>

                                    <input
                                        type="text"
                                        name="membershipNumber"
                                        value={form?.membershipNumber || ""}
                                        onChange={handleChange}
                                        placeholder="Ingrese el código de profesional"
                                        className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/10
                    "
                                    />
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </GenericDrawer >
        </>
    );
};

export default EditUserDrawer;