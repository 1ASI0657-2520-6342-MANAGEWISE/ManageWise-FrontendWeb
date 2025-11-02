import Post from '@/models/post.entity';

export const examplePosts = [
    new Post(
        1,
        'fundacionSaludTotal',
        'Campaña de Vacunación Infantil',
        'Salud',
        'Únete a nuestra campaña para vacunar a niños en comunidades rurales y prevenir enfermedades como el sarampión y la polio.',
        4.9,
        new Date('2025-05-20T09:00:00')
    ),
    new Post(
        2,
        'bancoAlimentosLima',
        'Recolección de Alimentos para Familias Vulnerables',
        'Caridad',
        'Estamos recolectando alimentos no perecibles para distribuir a familias afectadas por la crisis económica en Lima.',
        4.7,
        new Date('2025-06-05T11:30:00')
    ),
    new Post(
        3,
        'asociacionSonrisas',
        'Jornada de Salud Bucal para Niños',
        'Salud',
        'Organizamos una jornada gratuita de salud bucal para niños en zonas de bajos recursos. ¡Colabora como voluntario!',
        4.8,
        new Date('2025-06-12T15:00:00')
    ),
    new Post(
        4,
        'redSolidaria',
        'Donación de Ropa y Abrigo para el Invierno',
        'Caridad',
        'Ayuda a personas sin hogar donando ropa de abrigo y mantas para enfrentar el invierno en la ciudad.',
        4.6,
        new Date('2025-06-18T17:45:00')
    )
];

export default examplePosts;