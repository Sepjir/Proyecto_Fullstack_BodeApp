CREATE TABLE tipo_de_usuario (
    id_tipo_usuario SERIAL PRIMARY KEY,
    tipo_de_usuario VARCHAR(255) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_tipo_usuario INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    FOREIGN KEY(id_tipo_usuario) REFERENCES tipo_de_usuario(id_tipo_usuario)
);

CREATE TABLE tipo_de_insumo (
    id_tipo_insumo SERIAL PRIMARY KEY,
    tipo_de_insumo VARCHAR(255) NOT NULL
);

CREATE TABLE insumo (
    id_insumo SERIAL PRIMARY KEY,
    id_tipo_insumo INT NOT NULL,
    nombre_de_insumo VARCHAR(255) NOT NULL,
    FOREIGN KEY(id_tipo_insumo) REFERENCES tipo_de_insumo(id_tipo_insumo)
);

CREATE TABLE bodegas (
    id_bodega SERIAL PRIMARY KEY,
    nombre_bodega VARCHAR(255) NOT NULL
);

CREATE TABLE area (
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR(255) NOT NULL
);

CREATE TABLE ingresos (
    id_ingreso SERIAL PRIMARY KEY,
    id_insumo INT NOT NULL,
    id_tipo_insumo INT NOT NULL,
    id_bodega INT NOT NULL,
    unidades_ingresadas INT NOT NULL,
    fecha_de_ingreso DATE NOT NULL,
    FOREIGN KEY(id_insumo) REFERENCES insumo(id_insumo),
    FOREIGN KEY(id_bodega) REFERENCES bodegas(id_bodega),
    FOREIGN KEY(id_tipo_insumo) REFERENCES tipo_de_insumo(id_tipo_insumo)
);

CREATE TABLE egresos (
    id_egresos SERIAL PRIMARY KEY,
    id_insumo INT NOT NULL,
    id_tipo_insumo INT NOT NULL,
    id_bodega INT NOT NULL,
    id_area INT NOT NULL,
    cantidad_saliente INT NOT NULL,
    persona_recibe VARCHAR(255) NOT NULL,
    fecha_egreso DATE NOT NULL,
    FOREIGN KEY(id_insumo) REFERENCES insumo(id_insumo),
    FOREIGN KEY(id_bodega) REFERENCES bodegas(id_bodega),
    FOREIGN KEY(id_tipo_insumo) REFERENCES tipo_de_insumo(id_tipo_insumo),
    FOREIGN KEY(id_area) REFERENCES area(id_area)
);

CREATE TABLE stock (
    id_insumo INT NOT NULL,
    id_tipo_insumo INT NOT NULL,
    id_bodega INT NOT NULL,
    cantidad_en_stock INT NOT NULL,
    FOREIGN KEY(id_insumo) REFERENCES insumo(id_insumo),
    FOREIGN KEY(id_tipo_insumo) REFERENCES tipo_de_insumo(id_tipo_insumo),
    FOREIGN KEY(id_bodega) REFERENCES bodegas(id_bodega)
);