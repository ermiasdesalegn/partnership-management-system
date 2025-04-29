import PropTypes from "prop-types";

const Table = ({ headers, rows }) => {
  return (
    <div className='overflow-x-auto shadow-lg rounded-lg'>
      <table className='min-w-full text-sm text-left text-gray-900'>
        <thead className='text-xs text-white uppercase bg-[#3c8dbc]'>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className='px-6 py-4 font-semibold'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='bg-white border-b hover:bg-[#3c8dbc]/5 transition-colors'>
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
              className='flex items-center justify-center px-3 h-8 leading-tight text-[#3c8dbc] bg-white border border-[#3c8dbc] rounded-s-lg hover:bg-[#3c8dbc] hover:text-white transition-colors'
            >
              Previous
            </a>
          </li>
          {[1, 2, 3, 4, 5,].map((page) => (
            <li key={page}>
              <a
                href='#'
                className='flex items-center justify-center px-3 h-8 leading-tight text-[#3c8dbc] bg-white border border-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white transition-colors'
              >
                {page}
              </a>
            </li>
          ))}
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-[#3c8dbc] bg-white border border-[#3c8dbc] rounded-e-lg hover:bg-[#3c8dbc] hover:text-white transition-colors'
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