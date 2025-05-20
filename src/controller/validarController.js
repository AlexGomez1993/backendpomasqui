import nodemailer from "nodemailer";
import { Cliente } from "../models/index.js";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validarMail = async (req, res) => {

    try {
        const { correo, ruc } = req.body;

        const clienteExistente = await Cliente.findOne({
            where: {
                email: correo,
                ruc: ruc,
                estado: 3,
            },
        });

        if (!clienteExistente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 10 * 60 * 1000);

        clienteExistente.codigoTemporal = codigo;
        clienteExistente.codigoExpiracion = expiracion;
        await clienteExistente.save();
        const contenido = `
    <table style="width:100%; max-width:600px; margin:auto; font-family:Arial, sans-serif; border:1px solid #e0e0e0; border-collapse:collapse; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <tr style="background-color:#821a3b; color:white;">
        <td style="padding:20px; text-align:left; vertical-align:middle;">
          <img src="cid:logo" alt="Scala Logo" style="height:50px; margin-right:10px;" />
        </td>
        <td style="padding:20px; text-align:left; vertical-align:middle;">
          <h2 style="margin:0;">Sistema de Canjes</h2>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:20px; text-align:center;">
          <p style="margin:0; font-size:16px;">
            <strong>Estimado(a): ${clienteExistente.nombre} ${clienteExistente.apellidos}</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:20px;">
          <p style="font-size:15px; color:#333;">
            Por tu seguridad, no compartas esta información con NADIE. Para cambiar tu contraseña, tu código es:
          </p>
          <p style="font-size:24px; font-weight:bold; color:#821a3b; text-align:center; margin:20px 0;">
            ${codigo}
          </p>
          <p style="font-size:14px; color:#555;">
            * Copia este código y pégalo en el formulario de cambio de contraseña.
          </p>
          <p style="font-size:14px; color:#555;">
            <strong>Este código tiene una duración de 10 minutos.</strong>
          </p>
        </td>
      </tr>
      <tr style="background-color:#f9f9f9;">
        <td colspan="2" style="padding:20px; text-align:center; font-size:13px; color:#888;">
          Este mensaje se ha generado automáticamente, favor no responder al mismo.
        </td>
      </tr>
    </table>
`;


        const transporter = nodemailer.createTransport({
            host: "mail.plazapomasqui.com",
            port: 465,
            secure: true,
            auth: {
                user: "scalacanjes@plazapomasqui.com",
                pass: "tqom]@S#u3G1",
            },
        });

        const mailOptions = {
            from: "scalacanjes@plazapomasqui.com",
            to: clienteExistente.email,
            subject: "Cambio de contraseña",
            html: contenido,
            attachments: [
                {
                    filename: 'logo-scala-blanco.png',
                    path: path.join(__dirname, '../../public/logo-scala-blanco.png'),
                    cid: 'logo'
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            msg: "Correo enviado correctamente",
        });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ msg: "Error al procesar la solicitud" });
    }
};

const cambiarContrasena = async (req, res) => {
    try {
        const { correo, ruc, codigo, nuevaContrasena } = req.body;

        const clienteExistente = await Cliente.findOne({
            where: {
                email: correo,
                ruc: ruc,
                estado: 3,
            },
        });


        if (!clienteExistente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        const ahora = new Date();
        if (clienteExistente.codigoTemporal !== codigo ||
            !clienteExistente.codigoExpiracion ||
            ahora > clienteExistente.codigoExpiracion) {
            return res.status(400).json({ msg: "Código inválido o expirado" });
        }
        clienteExistente.contrasena = nuevaContrasena;
        clienteExistente.codigoTemporal = null;
        clienteExistente.codigoExpiracion = null;

        await clienteExistente.save();

        return res.status(200).json({
            msg: `Contraseña actualizada correctamente`,
            cliente: clienteExistente.nombre,
            id: clienteExistente.id,
        });
    } catch (error) {
        console.error("Error al cambiar la contraseña del cliente:", error);
        return res.status(500).json({ msg: "Error al procesar la solicitud" });
    }
};

export { validarMail, cambiarContrasena };
