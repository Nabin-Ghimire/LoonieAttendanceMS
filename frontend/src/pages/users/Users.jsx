import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getUsers, updateUser } from "../../http/api";
import { Trash, UserPen } from "lucide-react";
import { useState } from "react";
import { userAuthStore } from "../../store";


const Users = () => {

  const { user: loggedInUser } = userAuthStore();

  const queryClient = useQueryClient();

  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: ({ data, id }) => getUsers(data, id).then((res) => res.data)
  });
  const updateUserMutation = useMutation({
    mutationFn: ({ data, id }) => updateUser(data, id).then((res) => res.data),
    onSuccess: () => {
      setEditingUser(null)
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
  const createUserMutation = useMutation({
    mutationFn: (data) => createUser(data).then((res) => res.data),
    onSuccess: () => {
      setSelectedRole(null)
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
  const userDelete = useMutation({
    mutationFn: (id) => deleteUser(id).then((res) => res.data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleDelete = (user) => {
    console.log("Deleting user:", user);
    userDelete.mutate(user._id);


  }


  const handleUpdate = async (e) => {
    e.preventDefault();

    const orgValue = e.target.organizationId?.value;

    const updated = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      role: e.target.role.value
    };

    if (orgValue) {
      updated.organizationId = orgValue;
    }

    console.log(updated);

    try {
      updateUserMutation.mutate({ data: updated, id: editingUser._id });
      document.getElementById("edit_user_modal").close();
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();

    const createdUser = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      role: e.target.role.value
    };

    const orgValue = e.target.organizationId?.value;
    if (orgValue) {
      createdUser.organizationId = orgValue;
    }

    try {
      createUserMutation.mutate(createdUser);
      document.getElementById("create_user_modal").close();
    } catch (err) {
      console.log(err);
    }

  };



  return (

    <>

      <div className="overflow-x-auto">
        {loggedInUser.role === 'admin' && (<button className="btn" onClick={() => document.getElementById('create_user_modal').showModal()}>Create user</button>)}
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {loggedInUser?.role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {!usersLoading && users?.users?.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {loggedInUser.role == "admin" && (
                    <div className="flex items-center">
                      <button onClick={() => {
                        setEditingUser(user);
                        document.getElementById('edit_user_modal').showModal();

                      }}><UserPen className="" /></button>
                      <button disabled={user.role == 'admin'} onClick={() => {
                        handleDelete(user)

                      }
                      }><Trash className={user.role === "admin" ? 'ml-4  text-gray-300' : 'ml-4 text-red-500'} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <dialog id="edit_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit User</h3>

          {editingUser && (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">

              {/* First Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text mx-2">First Name</span>
                </label>
                <input
                  name="firstName"
                  defaultValue={editingUser.firstName}
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text mx-1">Last Name</span>
                </label>
                <input
                  name="lastName"
                  defaultValue={editingUser.lastName}
                  className="input input-bordered mx-2"
                  required
                />
              </div>

              {/* Role */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text mx-2">Role</span>
                </label>
                <select
                  name="role"
                  onChange={(e) => setEditingRole(e.target.value)}

                  defaultValue={editingUser.role}
                  className="select select-bordered mx-2"
                >
                  <option value="manager" >Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              {/* Manager */}
              {
                editingRole == "employee" && (<div className="form-control">
                  <label className="label">
                    <span className="label-text mx-2">Manager</span>
                  </label>
                  <select
                    name="organizationId"

                    defaultValue={
                      typeof editingUser.organizationId === "string"
                        ? editingUser.organizationId
                        : editingUser.organizationId?._id || ""
                    }

                    className="select select-bordered mx-2"
                  >
                    {users?.users?.filter(user => user.role === 'manager').map((user) => (
                      <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                    ))
                    }
                  </select>
                </div>)
              }

              {/* Buttons */}
              <div className="modal-action">
                <button className="btn btn-primary" type="submit">Save</button>
                <button type="button" className="btn" onClick={() => setEditingUser(null) || document.getElementById("edit_user_modal").close()}>
                  Cancel
                </button>
              </div>

            </form>
          )}
        </div>


        <button>close</button>

      </dialog >

      <dialog id="create_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create User</h3>


          {/* <form onSubmit={ } className="flex flex-col gap-4"> */}
          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text mx-2">First Name</span>
              </label>
              <input
                name="firstName"
                placeholder="Enter first name"
                className="input input-bordered"
                required
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text mx-1">Last Name</span>
              </label>
              <input
                name="lastName"
                placeholder="Enter last name"
                className="input input-bordered mx-2"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text mx-1">E-mail</span>
              </label>
              <input
                name="email"
                placeholder="Enter email"
                className="input input-bordered mx-2"
                required
                onError={"Email is required Field"}
              />
            </div>

            {/* Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text mx-2">Role</span>
              </label>
              <select
                onChange={(e) => setSelectedRole(e.target.value)}
                name="role"
                className="select select-bordered mx-2"
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            {/* Manager */}
            {selectedRole == "employee" && (<div className="form-control">
              <label className="label "
              >
                <span className="label-text mx-2">Manager</span>
              </label>
              <select
                name="organizationId"
                className="select select-bordered mx-2"
              >
                {users?.users?.filter(user => user.role === 'manager').map((user) => (
                  <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                ))
                }
              </select>
            </div>
            )}
            {/* Buttons */}
            <div className="modal-action">
              <button className="btn btn-primary" type="submit">Save</button>
              <button type="button" className="btn" onClick={() => setSelectedRole(null) || document.getElementById("create_user_modal").close()}>
                Cancel
              </button>
            </div>

          </form>

        </div>
      </dialog>



    </>

  )
}

export default Users;