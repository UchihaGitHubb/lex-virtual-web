// Tipos para grupos y códigos de clase

export interface CreateGroupDto {
  name?: string; // Opcional, el backend puede generar uno por defecto
}

export interface CreateGroupResponseDto {
  groupId: string;
  code: string;
  name: string | null;
  teacherId: string;
  teacherName: string | null;
  createdAt: string;
  // También puede venir envuelto en un objeto "group" dependiendo del endpoint
  group?: {
    id: string;
    code: string;
    name: string;
    teacherId: string;
    createdAt: string;
  };
}

export interface ValidateGroupCodeResponseDto {
  valid: boolean;
  group?: {
    id: string;
    code: string;
    name: string;
    teacher: {
      id: string;
      email: string;
    };
  };
  message?: string;
}

export interface JoinGroupDto {
  code: string;
}

export interface JoinGroupResponseDto {
  message: string;
  group: {
    id: string;
    code: string;
    name: string;
  };
}

export interface MyGroupResponseDto {
  group: {
    id: string;
    code: string;
    name: string;
    teacherId: string;
    createdAt: string;
  } | null;
}

