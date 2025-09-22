import React, { useState, useEffect } from "react";

const ShareModal = ({
  onClose,
  onShare,
  type,
  placeholderText,
  buttonText,
  id,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (isSearching) {
      fetch(
        `http://localhost:5051/user/search-users?query=${usernameOrEmail}`,
        {
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      setSearchResults([]);
    }
  }, [usernameOrEmail, isSearching]);

  const handleAddUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setPermissions((prev) => ({ ...prev, [user.id]: "edit" }));
    setUsernameOrEmail("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    setPermissions((prev) => {
      const newPermissions = { ...prev };
      delete newPermissions[userId];
      return newPermissions;
    });
  };

  const handlePermissionChange = (userId, permission) => {
    setPermissions((prev) => ({ ...prev, [userId]: permission }));
  };

  const handleShare = () => {
    const userIds = selectedUsers.map((user) => user.id);
    const userPermissions = selectedUsers.map((user) => permissions[user.id]);

    fetch(`http://localhost:5051/user/share-${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        userIds,
        permissions: userPermissions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Share successful:", data);
        onShare(usernameOrEmail);
      })
      .catch((error) => console.error("Error sharing:", error));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all"
      style={{ zIndex: 6969 }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden mx-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {type === "class"
                ? "Dela Klass"
                : type === "classroom"
                ? "Dela Klassrum"
                : "Dela Placering"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-6"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="w-full px-6 py-4">
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
              placeholder-gray-400 transition-all"
            placeholder={placeholderText || "Användarnamn eller e-post"}
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
            }}
            onClick={() => setIsSearching(true)}
            onKeyPress={(e) => e.key === "Enter" && handleShare()}
          />
          {searchResults.length > 0 && (
            <ul className="mt-4 border px-2 border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className="flex items-center justify-between pr-4 py-2 border-b hover:bg-white last:border-b-0 cursor-pointer"
                  onClick={() => {
                    handleAddUser(result);
                    setIsSearching(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <img
                        src={result.avatar}
                        alt={result.name}
                        className="inline-block border border-black w-12 h-12 rounded-full mr-2 object-cover"
                        style={{ aspectRatio: "1 / 1" }}
                      />
                    </div>
                    <div>
                      <span>{result.name}</span>
                      <br />
                      <span className="text-gray-500 text-sm">
                        {result.email}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {selectedUsers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800">
                Added Users
              </h3>
              <ul className="mt-2">
                {selectedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between pr-4 py-2 border-b hover:bg-white last:border-b-0"
                  >
                    <div className="flex items-center">
                      <div className="flex-grow">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="inline-block border border-black w-12 h-12 rounded-full mr-2 object-cover"
                          style={{ aspectRatio: "1 / 1" }}
                        />
                      </div>
                      <div>
                        <span>{user.name}</span>
                        <br />
                        <span className="text-gray-500 text-sm">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <select
                        value={permissions[user.id]}
                        onChange={(e) =>
                          handlePermissionChange(user.id, e.target.value)
                        }
                        className="ml-4 rounded-lg px-2 py-1 appearance-none"
                        style={{ border: "none", background: "none" }}
                      >
                        <option value="read">Read</option>
                        <option value="edit">Edit</option>
                      </select>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg
              transition-all transform hover:scale-[1.01] active:scale-95"
          >
            {buttonText || "Dela"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
