import PropTypes from "prop-types";

const Table = ({ headers, rows }) => {
  return (
    <div className='overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='min-w-full text-sm text-left text-gray-900 dark:text-gray-700'>
        <thead className='text-xs text-gray-900 uppercase bg-gray-400'>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className='px-6 py-3'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='bg-gray-100 border-b hover:bg-gray-200'>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className='px-6 py-4'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        className='flex justify-center items-center p-4'
        aria-label='Table navigation'
      >
        <ul className='inline-flex items-center -space-x-px'>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-s-lg  hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white'
            >
              Previous
            </a>
          </li>
          {[1, 2, 3, 4, 5,].map((page) => (
            <li key={page}>
              <a
                href='#'
                className='flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white'
              >
                {page}
              </a>
            </li>
          ))}
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-e-lg hover:text-gray-700 hover:bg-gray-400 dark:hover:text-white'
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
};

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default Table;