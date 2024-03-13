import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MasterContext } from "../../context/MasterContext";
import { GET_ROLES, ADD_ROLE, UPDATE_ROLE, DELETE_ROLE } from "../../constants";
import { AuthContext } from "../../context/AuthProvider";
import MasterContainer from "../MasterContainer";
import ModalContainer from "../ModalContainer";

const Roles = () => {
  const { auth } = useContext(AuthContext);
  const token = auth?.result?.token;

  const [data, setData] = useState([]);
  const [id, setId] = useState(0);
  const [roleName, setRoleName] = useState("");

  const { setIsUpdate, setIsReadOnly, isReadOnly, setShow, handleShow } =
    useContext(MasterContext);

  //getting roles from the api
  useEffect(() => {
    const getRoles = async () => {
      try {
        const { data: response } = await axios.get(GET_ROLES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.isSuccess) {
          toast.error(response?.errorMessage);
        }

        setData(response.result);
      } catch (error) {
        toast.error("Error fetching roles", error);
        console.error(error);
      }
    };

    getRoles();
  }, [token, data]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        ADD_ROLE,
        {
          roleName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData([...data, response.data.result.roleName]);
      console.log("response...", response.data.result.roleName);
      toast.success("Role saved successfully");
      setShow(false);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Error saving role");
    }
  };

  const handelUpdate = async () => {
    try {
      const response = await axios.post(
        UPDATE_ROLE,
        { roleId: id, roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Role updated successfully");
      setShow(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role");
    }
  };

  const handleDelete = async (id, name) => {
    try {
      const { data } = await axios.post(
        DELETE_ROLE,
        {
          roleId: id,
          roleName: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.isSuccess) {
        toast.success("Role Deleted Successfully");
      }
      setShow(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting role");
    }
  };

  const handleView = (id) => {
    const role = data.find((item) => item.id === id);
    if (role) {
      setId(id);
      setRoleName(role.name);
      setIsReadOnly(true);
      setIsUpdate(false);
      handleShow();
    }
  };

  const handleEdit = (id) => {
    const role = data.find((item) => item.id === id);
    if (role) {
      setId(id);
      setRoleName(role.name);
      setIsReadOnly(false);
      setIsUpdate(true);
      handleShow();
    }
  };

  const handleOnChange = (e) => {
    setRoleName(e.target.value);
  };

  return (
    <MasterContainer text={"Role"}>
      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered text-center">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Role Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name} </td>
                    <td className="d-flex justify-content-center align-items-center">
                      <Link
                        to="#"
                        className="view"
                        title="View"
                        data-toggle="tooltip"
                        style={{ color: "#10ab80" }}
                        onClick={() => handleView(item.id)}
                      >
                        <i className="material-icons">&#xE417;</i>
                      </Link>
                      <Link
                        to="#"
                        className="edit"
                        title="Edit"
                        data-toggle="tooltip"
                        onClick={() => handleEdit(item.id)}
                      >
                        <i className="material-icons">&#xE254;</i>
                      </Link>
                      <Link
                        to="#"
                        className="delete"
                        title="Delete"
                        data-toggle="tooltip"
                        onClick={() => handleDelete(item.id, item.name)}
                        style={{ color: "red" }}
                      >
                        <i className="material-icons">&#xE872;</i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ModalContainer
          text={"Role"}
          handelUpdate={handelUpdate}
          handleSave={handleSave}
        >
          <form>
            <div className="row">
              <div className="col">
                <label htmlFor="role" className="form-label">
                  Role Name<sup>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter Role name`}
                  onChange={handleOnChange}
                  value={roleName}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </form>
        </ModalContainer>
      </div>
    </MasterContainer>
  );
};

export default Roles;
