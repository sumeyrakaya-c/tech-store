import { useEffect, useState } from "react";
import "../styles/Users.css";

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://localhost:5000/api/users")
            .then(res => res.json())
            .then(data => {

                console.log("KULLANICILAR:", data);

                setUsers(data);
                setLoading(false);

            })
            .catch(err => {

                console.log("KULLANICI GETİRME HATASI:", err);
                setLoading(false);

            });

    }, []);


    return (

        <div className="users-page">

            <div className="users-header">

                <div>

                    <h1>Kullanıcılar</h1>

                    <p>
                        Sistemde kayıtlı kullanıcıları görüntüleyin.
                    </p>

                </div>

                <div className="user-count">

                    Toplam Kullanıcı:
                    <strong>{users.length}</strong>

                </div>

            </div>


            <div className="users-table">

                {loading ? (

                    <div className="users-empty">
                        Kullanıcılar yükleniyor...
                    </div>

                ) : users.length === 0 ? (

                    <div className="users-empty">

                        <h3>Kullanıcı bulunamadı.</h3>

                        <p>
                            Sistemde kayıtlı kullanıcı bulunmuyor.
                        </p>

                    </div>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Ad Soyad</th>
                                <th>E-posta</th>
                                <th>Telefon</th>
                                <th>Şehir</th>
                                <th>Rol</th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map(user => (

                                <tr key={user.id}>

                                    <td>
                                        #{user.id}
                                    </td>

                                    <td>
                                        {user.full_name || "-"}
                                    </td>

                                    <td>
                                        {user.email || "-"}
                                    </td>

                                    <td>
                                        {user.phone || "-"}
                                    </td>

                                    <td>
                                        {user.city || "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                user.role === "admin"
                                                    ? "role-admin"
                                                    : "role-user"
                                            }
                                        >
                                            {user.role === "admin"
                                                ? "Admin"
                                                : "Kullanıcı"}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default Users;