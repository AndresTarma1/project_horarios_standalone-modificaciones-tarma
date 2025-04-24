export interface Coordinador {
  id: string
  name: string
  last_name: string
  email: string
  phone: string
  identify: string
  departament: string
}

export const columnasCoordinador = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Nombre' },
  { field: 'last_name', header: 'Apellido' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Teléfono' },
  { field: 'identify', header: 'Identificación' },
  { field: 'departament', header: 'Departamento' }
];
