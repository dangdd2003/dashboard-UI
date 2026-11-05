import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import { useMediaQuery } from "react-responsive";
import useAxios from "@/hooks/useAxios";
import useAuth from "@/hooks/useAuth";
import UserDashboardAI from "@/apis/UserDashboardAI";
import { BASE_URL_USER } from "@/apis/config";
import useAxiosFunction from "@/hooks/useAxiosFunction";

type EditableFieldProps = {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  originalValue: string;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (value: string) => void;
};

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const PWD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()\-+=])(?=\S+$).{8,255}$/;

const DeleteConfirmationPopup: React.FC<
  { onConfirm: () => void; onCancel: () => void }
> = ({
  onConfirm,
  onCancel,
}) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
              onClick={onConfirm}
            >
              Yes, Delete Account
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

const EditableField = (
  { label, value, setValue, originalValue, isEditable, setIsEditable, onSave }:
    EditableFieldProps,
) => {
  const onCancel = () => {
    setValue(originalValue);
    setIsEditable(false);
  };

  const onToggle = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditable
        ? (
          <div className="flex flex-col items-start">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-hidden focus:border-blue-500"
            />
            <div>
              <button
                className="text-blue-500 hover:underline mt-2 disabled:opacity-50 disabled:no-underline"
                onClick={() => {
                  onSave(value.trim());
                  setIsEditable(false);
                }}
                disabled={!value || value.trim() === "" || value === originalValue}
              >
                Save
              </button>
              <button
                className="text-blue-500 hover:underline ml-2 mt-2 disabled:opacity-50 disabled:no-underline"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )
        : (
          <div className="flex items-center justify-between">
            <p className="text-gray-600 mb-2">{value}</p>
            <button
              className="text-blue-500 hover:underline"
              onClick={onToggle}
            >
              Edit
            </button>
          </div>
        )}
    </div>
  );
};

const Settings: React.FC = () => {
  const { auth, setAuth } = useAuth();
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const isBelowSm = useMediaQuery({ query: "(max-width: 640px)" });
  const isAboveMedium = useMediaQuery({ minWidth: 768 });

  const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [, deleteUserError, , deleteUserAF] = useAxiosFunction();
  const [, uploadAvatarError, , uploadAvatarAF] = useAxiosFunction();
  const [, updateUserError, , updateUserAF] = useAxiosFunction();
  const [, passwordError, , passwordAF] = useAxiosFunction();
  const [notice, setNotice] = useState("");

  // without `username` the backend returns the caller's own profile
  const [userResponse, , , refetchUser] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/users/profile",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [firstName, setFirstName] = useState<string>(userResponse?.data.firstname ?? "");
  const [lastName, setLastName] = useState<string>(userResponse?.data.lastname ?? "");
  const [email, setEmail] = useState<string>(userResponse?.data.email ?? "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isNewPasswordValid = PWD_REGEX.test(newPassword);


  const originalFirstName = userResponse?.data.firstname;
  const originalLastName = userResponse?.data.lastname;
  const originalEmail = userResponse?.data.email;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userResponse?.data) {
      setFirstName(userResponse.data.firstname);
      setLastName(userResponse.data.lastname);
      setEmail(userResponse.data.email);
    }
  }, [userResponse]);

  const handleUpdateField = async (
    field: "firstname" | "lastname" | "email",
    value: string,
  ) => {
    setNotice("");
    // partial update of the caller's own profile; other fields stay unchanged
    const res = await updateUserAF({
      axiosInstance: UserDashboardAI,
      method: "put",
      url: "/users/update",
      requestConfig: {
        data: { userDetail: { [field]: value } },
      },
    });
    if (res) setNotice("Profile updated");
    refetchUser();
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice("");
    const res = await passwordAF({
      axiosInstance: UserDashboardAI,
      method: "put",
      url: "/users/update-password",
      requestConfig: {
        data: { oldPassword, newPassword },
      },
    });
    if (res) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Password changed");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteConfirmationVisible(false);
    const res = await deleteUserAF({
      axiosInstance: UserDashboardAI,
      method: "delete",
      url: `/users/delete/${auth?.userId}`,
    });
    if (res) {
      // 204: account and all its data are gone, sign out
      localStorage.removeItem("auth");
      setAuth(null);
      window.location.href = "/";
    }
  };

  const handleSubmitAvatar = async () => {
    if (!avatar) return;
    setNotice("");
    const form = new FormData();
    form.append("image", avatar);
    const res = await uploadAvatarAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: `/files/upload-avatar`,
      requestConfig: {
        data: form,
      },
    });
    if (res) {
      setNotice(res.data?.message ?? "Avatar updated");
      setAvatarVersion((v) => v + 1);
    }
    setAvatar(null);
    // reset the avatar input
    // reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }


  //  console.log(firstName, lastName, email)
  return (
    <Container>
      <h1 className={`flex justify-center font-bold ${isAboveMedium ? "text-5xl" : "text-3xl mt-20"}`}>Settings</h1>
      <div
        className={`sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 ${isBelowSm && "w-full px-10"
          }`}
      >
        {notice && <p className="mt-5 text-green-600">{notice}</p>}
        {(updateUserError || uploadAvatarError || passwordError || deleteUserError) && (
          <p className="mt-5 text-red-600">
            {updateUserError || uploadAvatarError || passwordError || deleteUserError}
          </p>
        )}
        <div className="my-5">
          <label htmlFor="avatar" className="block text-lg font-medium text-gray-700 mb-2">Avatar</label>
          <input
            type="file"
            ref={fileInputRef}
            name="avatar"
            id="avatar"
            accept="image/png,image/jpeg"
            className="border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white"
            onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
          />
          {auth?.userId && (
            <img
              key={avatarVersion}
              src={`${BASE_URL_USER}files/get-avatar?id=${auth.userId}&v=${avatarVersion}`}
              alt=""
              className="mt-3 w-20 h-20 rounded-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          {avatar && avatar.size > AVATAR_MAX_BYTES && (
            <p className="text-sm text-red-500">The avatar must be at most 5 MiB</p>
          )}
          {avatar && avatar.size <= AVATAR_MAX_BYTES && (
            <button onClick={handleSubmitAvatar} className="ml-5 my-4 px-4 py-2 bg-blue-500 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">Submit</button>
          )}
        </div>

        {/* Editable first name */}
        <EditableField
          label="First Name"
          onSave={(v) => handleUpdateField("firstname", v)}
          value={firstName}
          setValue={setFirstName}
          originalValue={originalFirstName}
          isEditable={isFirstNameEditable}
          setIsEditable={setIsFirstNameEditable}
        />

        {/* Editable last name */}
        <EditableField
          label="Last Name"
          onSave={(v) => handleUpdateField("lastname", v)}
          value={lastName}
          setValue={setLastName}
          originalValue={originalLastName}
          isEditable={isLastNameEditable}
          setIsEditable={setIsLastNameEditable}
        />

        {/* Editable email settings */}
        <EditableField
          label="Email"
          onSave={(v) => handleUpdateField("email", v)}
          value={email}
          setValue={setEmail}
          originalValue={originalEmail}
          isEditable={isEmailEditable}
          setIsEditable={setIsEmailEditable}
        />
        {/* </div> */}
        {/* )} */}

        {/* Password change */}
        <form className="mb-6" onSubmit={handleChangePassword}>
          <h3 className="text-xl font-semibold mb-2">Change Password</h3>
          <input
            type="password"
            placeholder="Current password"
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md"
          />
          {newPassword && !isNewPasswordValid && (
            <p className="text-sm text-red-500">
              8-255 characters, no spaces, with an uppercase letter, a lowercase letter, a digit
              and one of @#$%^&amp;*()-+=
            </p>
          )}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!oldPassword || !isNewPasswordValid || newPassword !== confirmPassword}
          >
            Change Password
          </button>
        </form>

        {/* Account deletion */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Account Deletion</h3>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => setIsDeleteConfirmationVisible(true)}
          >
            Delete Account
          </button>
          {isDeleteConfirmationVisible && (
            <DeleteConfirmationPopup
              onConfirm={handleDeleteAccount}
              onCancel={() => setIsDeleteConfirmationVisible(false)}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Settings;
